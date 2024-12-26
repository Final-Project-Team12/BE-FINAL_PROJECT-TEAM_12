const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const jwtToken = jwt.sign(
    { user_id: 4, user_email: 'user4@example.com', user_role: 'admin' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

let airlineIdTest;

describe('AirlineController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        // server.close();
    });

    it('should create a new airline and return 201', async () => {
        const imagePath = path.join(__dirname, '../assets/sample.png');

        const imageBuffer = fs.readFileSync(imagePath);

        const response = await request(app)
            .post('/api/v1/airline')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('airline_name', 'Test Airline')
            .attach('image', imageBuffer, 'sample.png');

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Image successfully uploaded to airline',
            data: expect.any(Object),
        });

        airlineIdTest = response.body.data.airline_id;
    },30000);

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/v1/airline')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('airline_name', '')
            .attach('image', Buffer.from(''), '');

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Airline name, times used, and image must all be provided.',
        });
    },30000);

    it('should return 400 if image file is missing', async () => {
        const response = await request(app)
            .post('/api/v1/airline')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('airline_name', 'Test Airline');

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Airline name, times used, and image must all be provided.',
        });
    },30000);


    it('should return the created airline details and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/airline/${airlineIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airline retrieved successfully',
            data: expect.any(Object),
        });
    },30000);

    it('should return 404 if airline was not found.', async () => {
        const response = await request(app)
            .get(`/api/v1/airline/999999`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Airline not found',
        });
    },30000);

    // it('should handle unexpected errors during retrieval by ID and return 500', async () => {
    //     jest.spyOn(prisma.airline, 'findUnique').mockImplementationOnce(() => {
    //         throw new Error('Simulated error');
    //     });

    //     const response = await request(app)
    //         .get(`/api/v1/airline/invalid-id`)
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // },30000);

    it('should return a list of airlines and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/airline')
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airlines retrieved successfully',
            data: expect.arrayContaining([expect.objectContaining({
                airline_id: expect.any(Number),
                airline_name: expect.any(String),
                image_url: expect.any(String),
            })]),
        });
    },30000);

    it('should update an existing airline and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/airline/${airlineIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                airline_name: 'Updated Airline',
                times_used: 10
            });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airline successfully updated',
            data: expect.any(Object),
        });
    },30000);

    it('should update an existing airline including image and return 200', async () => {
        const imagePath = path.join(__dirname, '../assets/updateSample.png');

        const imageBuffer = fs.readFileSync(imagePath);
        const response = await request(app)
            .put(`/api/v1/airline/${airlineIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', imageBuffer, 'updateSample.png');

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airline successfully updated',
            data: expect.any(Object),
        });
    }, 30000);

    it('should return 404 if airline was not found for update', async () => {
        const response = await request(app)
            .put(`/api/v1/airline/9999999`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                airline_name: 'Updated Airline',
                times_used: 10
            });
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Airline not found',
        });
    });

    // it('should return 400 if no data provided for the update', async () => {
    //     const response = await request(app)
    //         .put(`/api/v1/airline/${airlineIdTest}`)
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({});

    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'No data provided for the update.',
    //     });
    // },30000);

    // it('should handle unexpected errors during update and return 500', async () => {
    //     jest.spyOn(prisma.airline, 'update').mockImplementationOnce(() => {
    //         throw new Error('Simulated error');
    //     });

    //     const response = await request(app)
    //         .put(`/api/v1/airline/${airlineIdTest}`)
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             airline_name: 'Updated Airline',
    //             times_used: 'invalid-number'
    //         });

    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // },30000);

   

    it('should delete an existing airline and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/airline/${airlineIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airline successfully deleted',
        });
    },30000);

    it('should return 404 if airline to delete is not found', async () => {
        const response = await request(app)
            .delete('/api/v1/airline/9999')
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Airline not found');
    },30000);
});
