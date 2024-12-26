const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');



const jwtToken = jwt.sign(
    { user_id: 4, user_email: 'user4@example.com', user_role: 'admin' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

let planeId;

describe('PlaneController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new plane and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/planes')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                airline_id: 1,
                airport_id_origin: 5,
                airport_id_destination: 7,
                departure_time: "2024-12-28T10:00:00.000Z",
                arrival_time: "2024-12-28T14:00:00.000Z",
                departure_terminal: "A1",
                baggage_capacity: 500.0,
                plane_code: "PLN123",
                cabin_baggage_capacity: 50.0,
                meal_available: true,
                wifi_available: true,
                in_flight_entertainment: true,
                power_outlets: true,
                offers: "Free snacks",
                duration: 240
            });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Plane created successfully',
            data: expect.any(Object),
        });

        planeId = response.body.data.plane_id;
    });

    it('should return all planes and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/planes')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'All planes fetched successfully',
            data: expect.any(Array),
        });
    });

    it('should return a plane by ID and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/planes/${planeId}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Plane fetched successfully',
            data: expect.any(Object),
        });
    });

    it('should return 404 for a non-existent plane', async () => {
        const response = await request(app)
            .get('/api/v1/planes/99999')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Plane not found',
        });
    });

    it('should update an existing plane and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/planes/${planeId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                departure_terminal: "B2",
                meal_available: false,
                offers: "Updated snacks offer"
            });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Plane updated successfully',
            data: expect.any(Object),
        });
    });

    it('should delete an existing plane and return 204', async () => {
        const response = await request(app)
            .delete(`/api/v1/planes/${planeId}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
    });

    
});
