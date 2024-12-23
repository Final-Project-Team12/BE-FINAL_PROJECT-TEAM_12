const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

let notification;
let user;
let userAdmin;
let userToken;
let adminToken;

describe('RestrictJwt Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');

        user = await prisma.users.findFirst({
            where: {
                role: 'user'
            }
        })

        userAdmin = await prisma.users.findFirst({
            where:{
                role: 'admin'
            }
        })
        
        notification = await prisma.notification.create({
            data:{
                title: 'test notification',
                description: 'test description',   
                notification_date: new Date(),
                user_id: user.user_id,
                is_read: false
            }
        })

        userToken = jwt.sign(
            { user_id: user.user_id, email: user.email, user_role: user.role },
            process.env.JWT_SECRET || 'jwt-b1n4r14n',
            { expiresIn: '1h' }
        );

        adminToken = jwt.sign(
            { user_id: userAdmin.user_id, email: userAdmin.email, user_role: userAdmin.role },
            process.env.JWT_SECRET || 'jwt-b1n4r14n',
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => {
        let check = await prisma.notification.findFirst({
            where:{
                notification_id: notification.notification_id
            }
        })
        if(check){
            await prisma.notification.delete({
                where:{
                    notification_id: notification.notification_id
                }
            })
        }

        await prisma.$disconnect();
        console.log('Database disconnected');
    });

    //get all flights
    it('should return with not authorized and code 401', async () => {
        const response = await request(app)
            .delete(`/api/v1/notifications/${notification.notification_id}`)
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authorized');
    }, 20000);
    it('should return with not authorized and code 401', async () => {
        const response = await request(app)
            .delete(`/api/v1/notifications/${notification.notification_id}`)
            .set('Authorization', `Bearer $2b$10ad19823131231321asdasjhads`)
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authorized');
    }, 20000);
    it('should return with user not found and code 401', async () => {
        let wrongToken = jwt.sign(
            { user_id: '1', email: 'ohteremail@gmail.com', user_role: "admin" },
            process.env.JWT_SECRET || 'jwt-b1n4r14n',
            { expiresIn: '1h' }
        );

        const response = await request(app)
            .delete(`/api/v1/notifications/${notification.notification_id}`)
            .set('Authorization', `Bearer ${wrongToken}`)
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('User not found');
    }, 20000);
    it('should return with not authorized and code 401', async () => {
        const response = await request(app)
            .delete(`/api/v1/notifications/${notification.notification_id}`)
            .set('Authorization', `Bearer ${userToken}`)
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authorized');
    }, 20000);

    //DELETE SUCCESSFULLY
    it('should return with not authorized and code 401', async () => {
        const response = await request(app)
            .delete(`/api/v1/notifications/${notification.notification_id}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Notification deleted successfully');
    }, 20000);
})