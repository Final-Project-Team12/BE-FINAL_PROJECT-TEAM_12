const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

let user;
let token;

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

    it('should create a new user and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .set('Content-Type', 'application/json')
            // .set('Authorization', `Bearer ${jwtToken}`)
            // .set('Content-Type', 'multipart/form-data')            
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

        // console.log('Response:', response.status, response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Success');
        // expect(response.body).toMatchObject({
        //     "status": 200,
        //     "message": "Success",
        //     "data": {
        //         "user_id": expect.,
        //         "name": "dummy",
        //         "telephone_number": "0812345678",
        //         "email": "dummyemail@gmail.com",
        //         "password": expect.stringMatching(/^(\$2[ab]\$[0-9]{2}\$[A-Za-z0-9./]{53})$/),
        //         "address": "Smith Road Number 10",
        //         "gender": "male",
        //         "identity_number": "127123456789",
        //         "age": 20,
        //         "role": "user",
        //         "otp_expiry": expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/),
        //         "reset_token": null,
        //         "verified": false
        //     }
        // });
    });

    it('should return the message details of OTP resent and return 200', async () => {
        const response = await request(app)
            .post(`/api/v1//user/resend`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:'password',
            });


        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OTP successfully resent');
    });

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


        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account verified');
    });

    it('should return the message details of login and return 200', async () => {
        const response = await request(app)
            .post(`/api/v1//user/login`)
            .set('Content-Type', 'application/json')
            .send({
                email:'dummyemail@gmail.com',
                password:`password`,
            });

        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login success');
    });

    it('should return the message details of successful update and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                name:'dummmy edited',
                telephone_number:"08123123761"
            });

        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('should return the message details of successful read and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)

        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('should return the message details of successful delete and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1//user/${user.user_id}`)
            .set('Authorization', `Bearer ${token}`)

        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    //error handlings
});