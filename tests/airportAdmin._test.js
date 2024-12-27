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

let airportIdTest;

describe('AirportController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        // server.close();
    });

    it('should create a new airport and return 201', async () => {
        const imagePath = path.join(__dirname, '../assets/sample.png');
    
        const imageBuffer = fs.readFileSync(imagePath);
    
        const response = await request(app)
            .post('/api/v1/airport')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Test Airport')
            .field('airport_code', 'TST')
            .field('continent_id', 1)
            .field('address', '123 Airport St, City, Country')
            .attach('image', imageBuffer, 'sample.png'); 
    
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Airport successfully created and image uploaded.',
        });
    
        airportIdTest = response.body.data.airport_id;
    },30000);

    it('should create a new airport and return 201', async () => {
        const imagePath = path.join(__dirname, '../assets/express-svgrepo-com.svg');
    
        const imageBuffer = fs.readFileSync(imagePath);
    
        const response = await request(app)
            .post('/api/v1/airport')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Test Airport')
            .field('airport_code', 'TST')
            .field('continent_id', 1)
            .field('address', '123 Airport St, City, Country')
            .attach('image', imageBuffer, 'express-svgrepo-com.svg'); 
    
        expect(response.status).toBe(500);
    
    },30000);

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/v1/airport')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('name', '')
            .field('airport_code', '')
            .field('continent_id', '')
            .field('address', '');
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Airport name, airport code, and continent ID must be provided.',
        });
    },30000);

    it('should return 400 if image file is required.', async () => {
        jest.spyOn(prisma.airport, 'create').mockImplementationOnce(() => {
            throw new Error('Simulated error');
        });

        const response = await request(app)
            .post('/api/v1/airport')
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Test Airport')
            .field('airport_code', 'TST')
            .field('continent_id', 1)
            .field('address', '123 Airport St, City, Country')
            .attach('image', Buffer.from('mockFile'));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Image file is required.');
    },30000);

    

    // it('should handle unexpected errors during creation and return 500', async () => {
    //     jest.spyOn(prisma.airport, 'create').mockImplementationOnce(() => {
    //         throw new Error('Simulated error');
    //     });

    //     const response = await request(app)
    //         .post('/api/v1/airport')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .set('Content-Type', 'multipart/form-data')
    //         .field('name', 'Test Airport')
    //         .field('airport_code', 'TST')
    //         .field('continent_id', 'false')
    //         .field('address', '123 Airport St, City, Country')
    //         .attach('image', Buffer.from('mockFile'), 'test.jpg');

    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // });

    it('should return the created airport details and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/airport/${airportIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airport details successfully retrieved.',
            data: expect.any(Object),
        });
    },30000);

    it('should return 404 if airport was not found.', async () => {
        const response = await request(app)
            .get(`/api/v1/airport/999999`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'The requested airport was not found.',
        });
    },30000);

    // it('should handle unexpected errors during retrieval by ID and return 500', async () => {
    //     jest.spyOn(prisma.airport, 'findUnique').mockImplementationOnce(() => {
    //         throw new Error('Simulated error');
    //     });

    //     const response = await request(app)
    //         .get(`/api/v1/airport/invalid-id`)
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // });

    it('should return a list of airports and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/airport')
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'List of airports successfully retrieved.',
            data: expect.arrayContaining([expect.objectContaining({
                airport_id: expect.any(Number),
                name: expect.any(String),
                airport_code: expect.any(String),
            })]),
        });
    },30000);
    

    it('should update an existing airport and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/airport/${airportIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                name: 'Updated Airport',
                airport_code: 'TST-UPD',
                continent_id: 1,
                address: '456 Updated St, City, Country'
            });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airport successfully updated.',
            data: expect.any(Object),
        });
    },30000);

    it('should update an existing airport, delete old image, and return 200 PNG', async () => {
        const airport = await prisma.airport.findUnique({
            where: { airport_id: airportIdTest },
        });
    
        console.log('Airport retrieved:', airport);
        expect(airport).not.toBeNull();
        expect(airport?.file_id).toBeDefined();
    
        const imagePath = path.join(__dirname, '../assets/updateSample.png');
        const imageBuffer = fs.readFileSync(imagePath);
    
        const response = await request(app)
            .put(`/api/v1/airport/${airportIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Updated Airport')
            .field('airport_code', 'TST-UPD')
            .field('continent_id', 1)
            .field('address', '456 Updated St, City, Country')
            .attach('image', imageBuffer, 'updateSample.png');
    
        console.log('Response received:', response.body);
    
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airport successfully updated.',
            data: expect.any(Object),

        });
    }, 30000);

    it('should return 404 if airport was not found', async () => {
        const response = await request(app)
            .put(`/api/v1/airport/9999999`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                name: 'Updated Airport',
                airport_code: 'TST-UPD',
                continent_id: 1,
                address: '456 Updated St, City, Country'
            });
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'The airport to update was not found.',
        });
    },30000);

    it('should return 404 if no data provided for the update', async () => {
        const response = await request(app)
            .put(`/api/v1/airport/${airportIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'No data provided for the update.',
        });
    },30000);

    // it('should handle unexpected errors during update and return 500', async () => {
    //     jest.spyOn(prisma.airport, 'update').mockImplementationOnce(() => {
    //         throw new Error('Simulated error');
    //     });

    //     const response = await request(app)
    //         .put(`/api/v1/airport/${airportIdTest}`)
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             name: 'Updated Airport',
    //             airport_code: 'TST-UPD',
    //             continent_id: 'false',
    //             address: '456 Updated St, City, Country'
    //         });

    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // });

    // it('should handle unexpected errors during deletion and return 500', async () => {
    //     const response = await request(app)
    //         .delete(`/api/v1/airport/1`)
    //         .set('Authorization', `Bearer ${jwtToken}`);
    
    //     // Validasi respons adalah 500
    //     expect(response.status).toBe(500);
    //     expect(response.body.message).toBe('Internal Server Error');
    // });
    
    it('should delete an existing airport and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/airport/${airportIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Airport successfully deleted.',
        });
    },30000);

    
    

    it('should return 404 if airport to delete is not found', async () => {
        const response = await request(app)
            .delete('/api/v1/airport/9999')
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('The airport to delete was not found.');
    },30000);
});
