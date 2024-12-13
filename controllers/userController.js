require("dotenv").config();
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mailer = require('../libs/mailer');
const crypto = require('crypto');

const { getUserByEmail, updateUserByEmail, createUser, updateUserById, getUserById, deleteUserById, checkOtherEmail } = require("../services/userService");

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
        return next(error);
      }
    }

    static async resendOtp(req, res, next){
      const { error, value } = login_schema.validate(req.body);
      if (error) {
          return res.status(400).json({
            status: 'bad request',
            statusCode: 400,
            message: 'input error',
            error: error.details[0].message
          });
      }
      try{
        let userData = await getUserByEmail(value.email);
    
        if(!userData){
          return res.status(401).json({
            status: false,
            message: 'invalid login',
          })
        }
        else{
          let isPassword = bcrypt.compareSync(value.password, userData.password)
          if(!isPassword){
            return res.status(401).json({
              status: false,
              message: 'invalid login',
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
              status: true,
              message: "OTP successfully resent",
              userData
            })
          }
        }
      }
      catch(error){
        return next(error);
      }
    }

    static async registerUser(req, res, next){
        try{
            const { error, value } = user_schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: 'bad request',
                    statusCode: 400,
                    message: 'input error',
                    error: error.details[0].message
                });
            }

            let password = bcrypt.hashSync(value.password, parseInt(HASH));
            const cekEmailUnik = await getUserByEmail(value.email)

            if(cekEmailUnik){
              return res.status(400).json({
                  status: 'bad request',
                  statusCode: 400,
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
              auth_method: 'manual',
              otp : otpGen,
              otp_expiry: otpExpiry
            }

            const newUser = await createUser(data);

            const { otp, ...userWithoutOtp } = newUser;
            
            return res.status(200).json({
                status: true,
                message: "success",
                data: userWithoutOtp
            });
          }
          catch (error) {
            next(error);
            return;
          }
    }

    static async verifyUser(req, res, next){
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({
          status: 'bad request',
          statusCode: 400, 
          message: 'Email and OTP are required'
        });
      }

      try {
        const user = await getUserByEmail(email);
  
        if (!user) {
          return res.status(404).json({ 
            status: 'bad request',
            statusCode: 400,
            message: 'User not found'
          });
        }
  
        const currentUtcTime = new Date().toISOString(); 
        
        const isOtpValid = user.otp === otp && user.otp_expiry > currentUtcTime;
  
        if (!isOtpValid) {
          return res.status(400).json({ 
            status: 'bad request',
            statusCode: 400,
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
          status: true,
          message: 'Account verified',
          userData
        });
      } catch (error) {
        next(error);
        return;
      }      
    }

    static async getUser(req, res, next){
      const user_id = req.params.user_id;
        try{
            let user = await getUserById(parseInt(user_id));
            
            if(user){
                return res.status(200).json({
                    status: true,
                    message: "success",
                    data: user
                })
            }
            else{
                return res.status(404).json({
                    status: false,
                    message: "user not found"
                })
            }
        }
        catch(error){
            next(error);
            return;
        }
    }
    static async updateUser(req, res, next){
      const user_id = req.params.user_id;
      try{
        const { error, value } = user_update_schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'bad request',
                statusCode: 400,
                message: 'input error',
                error: error.details[0].message
            });
        }

        const existingUser = await getUserById(parseInt(user_id));
        if (!existingUser) {
          return res.status(404).json({
              status: false,
              message: 'User not found',
          });
      }

        let password = req.body.password? bcrypt.hashSync(value.password, parseInt(HASH)) : existingUser.password
        const cekEmailUnik = await checkOtherEmail(value.email)
        if(cekEmailUnik){
          return res.status(400).json({
              status: 'bad request',
              statusCode: 400,
              message: "Email already used for another account"
          })
        }

        const data = {
          name: req.body.name || existingUser.name,
          telephone_number: req.body.telephone_number || existingUser.telephone_number,
          email: req.body.email || existingUser.email,
          password: req.body.password
              ? password
              : existingUser.password,
          address: req.body.address || existingUser.address,
          gender: req.body.gender || existingUser.gender,
          identity_number: req.body.identity_number || existingUser.identity_number,
          age: req.body.age || existingUser.age,
          role: "user"
      };

        const new_user = await updateUserById(parseInt(user_id), data)
        
        return res.status(200).json({
            status: true,
            message: "success",
            data: new_user
        });
      }
      catch (error) {
        next(error);
        return;
      }
    }
    static async deleteUser(req, res, next){
      const user_id = req.params.user_id;
      try{
          const existingUser = await getUserById(parseInt(user_id))
          if (!existingUser) {
              return res.status(404).json({
                status: false,
                message: "User not found",
              });
            }

          const deletedUser = await deleteUserById(parseInt(user_id));
          
          return res.status(200).json({
              status: true,
              message: "success",
              data: deletedUser
          })
      }
        catch(error){
            next(error);
            return;
        }
    }

    static async login(req, res, next){
      const { error, value } = login_schema.validate(req.body);
      if (error) {
          return res.status(400).json({
            status: 'bad request',
            statusCode: 400,
            message: 'input error',
            error: error.details[0].message
          });
      }
      try{
        let {email, password} = value;
        // console.log('masuk g ni')
        let userData = await getUserByEmail(email);
    
        if(!userData){
          return res.status(401).json({
            status: false,
            message: 'invalid login',
          })
        }

        else{
            let isPassword = bcrypt.compareSync(password, userData.password)
            if(!isPassword){
              return res.status(401).json({
                status: false,
                message: 'invalid login',
              })
            }
            else{
              if(userData.verified == false){
                return res.status(401).json({
                  status: false,
                  message: 'The email address has not been verified yet',
                })
              }
              const options = {
                expiresIn: '5d'
              };
              const accessToken = jwt.sign({
                  user_id: userData.user_id,
                  user_email: userData.email
              }, JWT_SECRET, options)
  
              return res.status(200).json({
                  status: true,
                  message: "Login success",
                  accessToken
              })
            }
        }
      }
      catch(error){
        next(error);
        return;
      }
    }
}

module.exports = UserController;