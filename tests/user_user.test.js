const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

let user;
let token;
let otherUser;

describe('UserController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');
        let check = await prisma.users.findFirst({
            where: {
                email: "dummyemail@gmail.com"
            }
        })
        if(check){
            await prisma.users.delete({
                where:{
                    email: "dummyemail@gmail.com"
                }
            })
        }
    });

    afterAll(async () => {
        await prisma.$connect();
        let check = await prisma.users.findFirst({
            where: {
                email: "dummyemail@gmail.com"
            }
        })
        if (check) {
            await prisma.users.delete({ where: { email: "dummyemail@gmail.com" } });
        }
        await prisma.$disconnect();
    });

    it('should use the test environment', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });

    //REGISTER
    it('should create a new user and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .set('Content-Type', 'application/json')       
            .send({
                name:'dummy',
                telephone_number:'0812345678',
                email:'dummyemail@gmail.com',
                password:'password',
                address:'Smith Road Number 10',
                gender:'male',
                identity_number:'127123456789',
                age:'20'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Success');
    }, 20000);
    //register errors
    it('should return 400 with error message name required', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .set('Content-Type', 'application/json')       
            .send({
                telephone_number:'0812345678',
                email:'dummyemail@gmail.com',
                password:'password',
                address:'Smith Road Number 10',
                gender:'male',
                identity_number:'127123456789',
                age:'20'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Input error');
    }, 20000);
    it('should return 400 with error message email exists', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .set('Content-Type', 'application/json')       
            .send({
                name:'dummy',
                telephone_number:'0812345678',
                email:'dummyemail@gmail.com',
                password:'password',
                address:'Smith Road Number 10',
                gender:'male',
                identity_number:'127123456789',
                age:'20'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already exists');
    }, 20000);

    //RESEND OTP
    it('should return the message details of OTP resent and return 200', async () => {
        const response = await request(app)
            .post(`/api/v1//user/resend`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:'password',
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OTP successfully resent');
    });
    //resend otp error
    it('should return the message details of input error and return 400', async () => {
        const response = await request(app)
            .post(`/api/v1//user/resend`)
            .set('Content-Type', 'application/json')
            .send({
                password:'password',
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Input error');
    });
    it('should return the message details of invalid login and return 401', async () => {
        const response = await request(app)
            .post(`/api/v1//user/resend`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail123@gmail.com',
                password:'password12314421',
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid login');
    });
    it('should return the message details of invalid login and return 401', async () => {
        const response = await request(app)
            .post(`/api/v1//user/resend`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:'password12314421',
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid login');
    });

    //LOGIN BEFORE VERIFY
    it('should return the message details of unverified login and return 401', async () => {
        const response = await request(app)
            .post(`/api/v1//user/login`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:`password`,
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('The email address has not been verified yet');
    });

    //VERIFY USER
    it('should return the message details of verified and return 200', async () => {
        user = await prisma.users.findFirst({
            where:{
                email: 'dummyemail@gmail.com'
            }
        })
        token = jwt.sign(
            { user_id: user.user_id, user_email: user.email, user_role: user.role },
            process.env.JWT_SECRET || 'jwt-b1n4r14n',
            { expiresIn: '1h' }
        );
        const response = await request(app)
            .post(`/api/v1//user/verify`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                otp:`${user.otp}`,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account verified');
    });
    //verify error handling
    it('should return the message details of email and otp required and return 400', async () => {
        const response = await request(app)
            .post(`/api/v1//user/verify`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and OTP are required');
    });
    it('should return the message details of user not found and return 404', async () => {
        const response = await request(app)
            .post(`/api/v1//user/verify`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail123@gmail.com',
                otp:`${user.otp}`
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
    it('should return the message details of otp invalid and return 400', async () => {
        const response = await request(app)
            .post(`/api/v1//user/verify`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                otp: '12'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid or expired OTP');
    });

    //LOGIN
    it('should return the message details of login and return 200', async () => {
        const response = await request(app)
            .post(`/api/v1//user/login`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:`password`,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login success');
    });
    //login error handlings
    it('should return the message details input error and return 400', async () => {
        const response = await request(app)
            .post(`/api/v1//user/login`)
            .set('Content-Type', 'application/json')
            .send({
                password:`password`,
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('input error');
    });
    it('should return the message details of invalid login and return 401', async () => {
        const response = await request(app)
            .post(`/api/v1//user/login`)
            .set('Content-Type', 'application/json')
            .send({
                email:'asdadsasd1ads@gmail.com',
                password:`password`,
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('invalid login');
    });
    it('should return the message details of invalid login and return 401', async () => {
        const response = await request(app)
            .post(`/api/v1//user/login`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:`password123`,
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('invalid login');
    });


    //UPDATE USER
    it('should return the message details of successful update and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                name:'dummmy edited',
                telephone_number:"08123123761"
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });
    //update error handling
    it('should return the error message details of updating another user and return 401', async () => {
        otherUser = await prisma.users.findFirst({
            where: {role:'user'}
        });

        otherToken = jwt.sign(
            { user_id: otherUser.user_id, user_email: otherUser.email, user_role: otherUser.role },
            process.env.JWT_SECRET || 'jwt-b1n4r14n',
            { expiresIn: '1h' }
        );

        const response = await request(app)
            .put(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .set('Content-Type', 'application/json')
            .send({
                name:'dummmy edited',
                telephone_number:"08123123761"
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Cannot update other user data');
    });
    it('should return the message details of input error and return 400', async () => {
        const response = await request(app)
            .put(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                email:'emailwrong'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Input error');
    });
    it('should return the message details of user not found and return 404', async () => {
        const response = await request(app)
            .put(`/api/v1//user/255`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                name:'dummmy edited',
                telephone_number:"08123123761"
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
    it('should return the message details of email used already and return 400', async () => {
        const response = await request(app)
            .put(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                email:'user1@example.com',
                telephone_number:"08123123761"
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already used for another account');
    });

    //READ
    it('should return the message details of successful read and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });
    //read error handlings
    it('should return the message details of cannot get other user and return 401', async () => {
        const response = await request(app)
            .get(`/api/v1//user/${otherUser.user_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Cannot get other user data');
    });
    it('should return the message details of user not found and return 404', async () => {
        const response = await request(app)
            .get(`/api/v1//user/255`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    //delete error handlings
    it('should return the message details of no user and return 404', async () => {
        const response = await request(app)
            .delete(`/api/v1//user/2556`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
    it('should return the message details of cannot delete other user and return 401', async () => {
        const response = await request(app)
            .delete(`/api/v1//user/${otherUser.user_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Cannot delete other user');
    });
    //DELETE
    it('should return the message details of successful delete and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    // //500 errors
    // it('should return 500 with message server error', async () => {
    //     await prisma.$disconnect();
    //     console.log('Database disconnected temporarily');
        
    //     const response = await request(app)
    //         .post('/api/v1/user')
    //         .set('Content-Type', 'application/json')       
    //         .send({
    //             name:'dummy',
    //             telephone_number:'0812345678',
    //             email:'dummyemail@gmail.com',
    //             password:'password',
    //             address:'Smith Road Number 10',
    //             gender:'male',
    //             identity_number:'127123456789',
    //             age:'20'
    //         });
    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // }, 20000);
});