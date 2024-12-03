require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const host = process.env.HOST;
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HASH = process.env.HASH;
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

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

class UserController{
    static genOtp(){
        //generate otp and send using nodemailer
        return '123456'
    }

    static async registerUser(req, res, next){
        try{
            const { error, value } = user_schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: 'input error',
                    error: error.details[0].message
                });
            }
            let password = bcrypt.hashSync(value.password, parseInt(HASH));
            const cekEmailUnik = await prisma.users.findUnique({
              where: {
                  email : value.email
              }
            })
            console.log(cekEmailUnik);
            if(cekEmailUnik){
              return res.status(400).json({
                  status : false,
                  message: "Email already exists"
              })
            }
            
            let otp = this.genOtp();
            const new_user = await prisma.users.create({
                data: {
                  name: value.name,
                  telephone_number: value.telephone_number,
                  email: value.email,
                  password: password,
                  address: value.address,
                  gender: value.gender,
                  identity_number: value.identity_number,
                  age: value.age,
                  role: 'user',
                  otp
                },
            });
            
            return res.status(200).json({
                status: true,
                message: "success",
                data: new_user
            });
          }
          catch (error) {
            next(error)
          }
    }
    static async getUser(req, res, next, user_id){
        try{
            let user = await prisma.users.findUnique({
                where: {
                    user_id : parseInt(user_id)
                }
            })
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
            next(error)
        }
    }
    static async updateUser(req, res, next, user_id){
        try{
            const { error, value } = user_schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: 'input error',
                    error: error.details[0].message
                });
            }
            let password = bcrypt.hashSync(value.password, parseInt(HASH));
            const cekEmailUnik = await prisma.users.findUnique({
              where: {
                  email : value.email
              }
            })
            if(cekEmailUnik){
              return res.status(400).json({
                  status : false,
                  message: "Email already exists"
              })
            }
            
            const new_user = await prisma.users.update({
                where: {
                    user_id: parseInt(user_id)
                },
                data: {
                  name: value.name,
                  telephone_number: value.telephone_number,
                  email: value.email,
                  password: password,
                  address: value.address,
                  gender: value.gender,
                  identity_number: value.identity_number,
                  age: value.age,
                  role: 'user',
                },
            });
            
            return res.status(200).json({
                status: true,
                message: "success",
                data: new_user
            });
          }
          catch (error) {
            next(error)
          }
    }
    static async deleteUser(req, res, next, user_id){
        try{
            const existingUser = await prisma.users.findUnique({
                where: {
                  user_id: parseInt(user_id),
                },
            });
            if (!existingUser) {
                return res.status(404).json({
                  status: false,
                  message: "User not found",
                });
              }

            const deletedUser = await prisma.users.delete({
                where: {
                    user_id: parseInt(user_id)
                }
            }) 
            
            return res.status(200).json({
                status: true,
                message: "success",
                data: deletedUser
            })
            
        }
        catch(error){
            next(error)
        }
    }
    static async login(req, res, next){
      const { error, value } = login_schema.validate(req.body);
      if (error) {
          return res.status(400).json({
            status: false,
            message: 'input error',
            error: error.details[0].message
          });
      }
      try{
        let {email, password} = value;
        // console.log('masuk g ni')
        let userData = await prisma.users.findUnique({
            where: {
                email
            }
        })
    
        if(!userData){
          return res.status(400).json({
            status: false,
            message: 'invalid login',
          })
        }
        else{
            let isPassword = bcrypt.compareSync(password, userData.password)
            if(!isPassword){
              return res.status(400).json({
                status: false,
                message: 'invalid login',
              })
            }
            else{
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
        next(error)
      }
    }
}

module.exports = UserController;