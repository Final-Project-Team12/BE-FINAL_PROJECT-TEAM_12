const request = require('supertest');
const app = require('../app'); // Entry point aplikasi
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

const jwtToken = jwt.sign(
    { user_id: 4, user_email: 'user4@example.com', user_role: 'admin' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

let seatIdTest;

describe('SeatController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new seat successfully and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/seats')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                seat_number: '100A',
                class: 'Economy',
                price: 1000000,
                plane_id: 40,
            });

        expect(response.status).toBe(201);
        seatIdTest = response.body.data.seat_id;

    });

    it('should retrieve a list of seats with pagination and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/seats?page=1&limit=5')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

    it('should retrieve a list of seats with default pagination and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/seats')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

    it('should retrieve a seat by ID and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/seats/${seatIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

    it('should return 404 if seat is not found by ID', async () => {
        const response = await request(app)
            .get('/api/v1/seats/999999')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
    });

    it('should update an existing seat and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/seats/${seatIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                price: 1100000,
            });
        expect(response.status).toBe(200);
    });

    it('should delete a seat by ID and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/seats/${seatIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

});
