const request = require('supertest');
const app = require('../app');  
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

// Generate a JWT token for testing (assuming admin role)
const jwtToken = jwt.sign(
    { user_id: 8, user_email: 'user8@example.com', user_role: 'admin' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

let notificationIdTest;

describe('NotificationController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new notification and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/notifications')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                title: 'Test Notification',
                description: 'This is a test notification.',
                user_id: 8 
            });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 'success',
            message: 'Notification created successfully',
            data: expect.any(Object),
        });

        notificationIdTest = response.body.data.notification_id;
    });

    it('should return 400 if required fields are missing when creating notification', async () => {
        const response = await request(app)
            .post('/api/v1/notifications')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                title: '',
                description: '',
                user_id: 8
            });

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 'bad request',
            message: 'Title, description, and user_id are required',
        });
    });

    it('should return 404 if notification not found when retrieving by ID', async () => {
        const response = await request(app)
            .get('/api/v1/notifications/99999')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'not found',
            message: 'Notification not found',
        });
    });

    it('should return the notification by ID and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/notifications/${notificationIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

    it('should return all the notification by ID and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/notifications`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

    it('should mark notification as read and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/notifications/${notificationIdTest}/read`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'success',
            message: 'Notification marked as read',
        });
    });

    it('should return 404 if notification not found when marking as read', async () => {
        const response = await request(app)
            .put('/api/v1/notifications/99999/read')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'not found',
            message: 'Notification not found',
        });
    });

    it('should delete the notification and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/notifications/${notificationIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'success',
            message: 'Notification deleted successfully',
        });
    });

    it('should return 404 if notification not found when deleting', async () => {
        const response = await request(app)
            .delete('/api/v1/notifications/99999')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'not found',
            message: 'Notification not found',
        });
    });

    it('should retrieve notifications by user ID and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/notifications/user/5')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'success',
            data: expect.arrayContaining([expect.any(Object)]),
        });
    });

    it('should return 404 if no notifications found for the user', async () => {
        const response = await request(app)
            .get('/api/v1/notifications/user/99999')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'not found',
            message: 'No notifications found for the specified user',
        });
    });
});
