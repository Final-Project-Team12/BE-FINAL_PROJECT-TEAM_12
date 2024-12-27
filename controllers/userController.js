require("dotenv").config();
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mailer = require('../libs/mailer');
const crypto = require('crypto');

const { getUserByEmail, updateUserByEmail, createUser, updateUserById, getUserById, deleteUserById, checkOtherEmail } = require("../services/userService");
const generateToken = require('../utils/jwtGenerator');

const HASH = process.env.HASH;
const JWT_SECRET = process.env.JWT_SECRET;

const login_schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

const user_schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    telephone_number: joi.string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(15)
      .required(),
    email: joi.string().email().required(),
    password: joi.string()
      .min(8)
      .max(128)
    //   .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
      .required(),
    address: joi.string().max(255).required(),
    gender: joi.string()
      .valid('male', 'female')
      .required(),
    identity_number: joi.string().alphanum().min(5).max(20).required(),
    age: joi.number().integer().min(1).max(100).required(),
    // role: joi.string().valid('user', 'admin', 'moderator').required(),
  });

const user_update_schema = joi.object({
  name: joi.string().min(3).max(50),
  telephone_number: joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15),
  email: joi.string().email(),
  password: joi.string()
    .min(8)
    .max(128),
  //   .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/),
  address: joi.string().max(255),
  gender: joi.string()
    .valid('male', 'female'),
  identity_number: joi.string().alphanum().min(5).max(20),
  age: joi.number().integer().min(1).max(100),
  // role: joi.string().valid('user', 'admin', 'moderator').required(),
});

class UserController{
    static async genOtp(email, next){
      try{
        const otpGen = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        await Mailer.sendVerificationEmail(email, otpGen);

        return { otpGen, otpExpiry };
      }
      catch(error){
        /* istanbul ignore next */
        next(error);
      }
    }

    static async resendOtp(req, res, next){
      const { error, value } = login_schema.validate(req.body);
      if (error) {
          return res.status(400).json({
            status: 400,
            message: 'Input error',
            error: error.details[0].message
          });
      }
      try{
        let userData = await getUserByEmail(value.email);
    
        if(!userData){
          return res.status(401).json({
            status: 401,
            message: 'Invalid login',
          })
        }
        else{
          let isPassword = bcrypt.compareSync(value.password, userData.password)
          if(!isPassword){
            return res.status(401).json({
              status: 401,
              message: 'Invalid login',
            })
          }
          else{
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

            await Mailer.sendVerificationEmail(value.email, otp);

            const data = {
              otp,
              otp_expiry: otpExpiry
            }

            const userData = await updateUserByEmail(value.email, data)

            return res.status(200).json({
              status: 200,
              message: "OTP successfully resent"
            })
          }
        }
      }
      catch(error){
        /* istanbul ignore next */
        next(error);
      }
    }

    static async registerUser(req, res, next){
        try{
            const { error, value } = user_schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 400,
                    message: 'Input error',
                    error: error.details[0].message
                });
            }

            let password = bcrypt.hashSync(value.password, parseInt(HASH));
            const cekEmailUnik = await getUserByEmail(value.email)

            if(cekEmailUnik){
              return res.status(400).json({
                  status: 400,
                  message: "Email already exists"
              })
            }
            
            let { otpGen, otpExpiry } = await UserController.genOtp(value.email, next);
            
            const data = {
              name: value.name,
              telephone_number: value.telephone_number,
              email: value.email,
              password: password,
              address: value.address,
              gender: value.gender,
              identity_number: value.identity_number,
              age: value.age,
              role: 'user',
              otp : otpGen,
              otp_expiry: otpExpiry
            }

            const newUser = await createUser(data);

            const { otp, ...userWithoutOtp } = newUser;
            
            return res.status(201).json({
                status: 201,
                message: "Success",
                data: userWithoutOtp
            });
          }
          catch (error) {
            /* istanbul ignore next */
            next(error);
          }
    }

    static async verifyUser(req, res, next){
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({
          status: 400,
          message: 'Email and OTP are required'
        });
      }

      try {
        const user = await getUserByEmail(email);
  
        if (!user) {
          return res.status(404).json({ 
            status: 404,
            message: 'User not found'
          });
        }
  
        const currentUtcTime = new Date().toISOString(); 
        
        const isOtpValid = user.otp === otp && user.otp_expiry > currentUtcTime;
  
        if (!isOtpValid) {
          return res.status(400).json({ 
            status: 400,
            message: 'Invalid or expired OTP'
          });
        }
  
        const data = {
          verified: true, 
          otp: null, 
          otp_expiry: null
        };

        let userData = await updateUserByEmail(email, data);
  
        return res.status(200).json({
          status: 200,
          message: 'Account verified',
          userData
        });
      } catch (error) {
        /* istanbul ignore next */
        next(error);
      }      
    }

    static async getUser(req, res, next){
      const user_id = req.params.user_id;
      const existingUser = await getUserById(parseInt(user_id))
      if (!existingUser) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
          });
      }
      try{
        if(!(req.user.user_id == user_id)){
          return res.status(401).json({
            status: 401,
            message: "Cannot get other user data"
          })
        }
        let user = existingUser;
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: user
        })
      }
      catch(error){
        /* istanbul ignore next */
        next(error);
      }
    }
    static async updateUser(req, res, next){
      const user_id = req.params.user_id;
      const existingUser = await getUserById(parseInt(user_id));
      if (!existingUser) {
        return res.status(404).json({
            status: 404,
            message: 'User not found',
        });
      }
      try{
        if(!(req.user.user_id == user_id)){
          return res.status(401).json({
            status: 401,
            message: "Cannot update other user data"
          })
        }
        const { error, value } = user_update_schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: 'Input error',
                error: error.details[0].message
            });
        }
        let email = req.body.email || existingUser.email;


        let check = !(existingUser.email == email)
        if(check){
          /* istanbul ignore next */
          const cekEmailUnik = await checkOtherEmail(email)
          /* istanbul ignore next */
          if(cekEmailUnik){
            return res.status(400).json({
                status : 400,
                message: "Email already used for another account"
            })
          }
        }
        /* istanbul ignore next */
        const data = {
          name: req.body.name || existingUser.name,
          telephone_number: req.body.telephone_number || existingUser.telephone_number,
          email,
          address: req.body.address || existingUser.address,
          identity_number: req.body.identity_number || existingUser.identity_number,
          age: parseInt(req.body.age) || existingUser.age,
          role: "user"
        };

        const new_user = await updateUserById(parseInt(user_id), data)
        
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: new_user
        });
      }
      catch (error) {
        /* istanbul ignore next */
        next(error);
      }
    }
    static async deleteUser(req, res, next){
      const user_id = req.params.user_id;
      const existingUser = await getUserById(parseInt(user_id))
      if (!existingUser) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
          });
      }
      try{
        if(!(req.user.user_id == user_id)){
          return res.status(401).json({
            status: 401,
            message: "Cannot delete other user"
          })
        }
          // currUserId = req.user.

          const deletedUser = await deleteUserById(parseInt(user_id));
          
          return res.status(200).json({
              status: 200,
              message: "Success",
              data: deletedUser
          })
      }
        catch(error){
          /* istanbul ignore next */
          next(error);
        }
    }

    static async login(req, res, next){
      const { error, value } = login_schema.validate(req.body);
      if (error) {
          return res.status(400).json({
            status: 400,
            message: 'input error',
            error: error.details[0].message
          });
      }
      try{
        let {email, password} = value;
        let userData = await getUserByEmail(email);
    
        if(!userData){
          return res.status(401).json({
            status: 401,
            message: 'invalid login',
          })
        }

        else{
            let isPassword = bcrypt.compareSync(password, userData.password)
            if(!isPassword){
              return res.status(401).json({
                status: 401,
                message: 'invalid login',
              })
            }
            else{
              if(userData.verified == false){
                return res.status(401).json({
                  status: 401,
                  message: 'The email address has not been verified yet',
                })
              }

              const accessToken = generateToken(userData);
  
              return res.status(200).json({
                  status: 200,
                  message: "Login success",
                  accessToken
              })
            }
        }
      }
      catch(error){
        /* istanbul ignore next */
        next(error);
      }
    }
}

module.exports = UserController;