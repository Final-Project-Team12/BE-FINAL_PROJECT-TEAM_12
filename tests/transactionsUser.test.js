const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

const jwtToken = jwt.sign(
    { user_id: 11, user_email: 'dummy@gmail.com', user_role: 'user' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

describe('TransactionsController Integration Tests', () => {
    let transactionIdTest;

    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');
        transactionIdTest = 1; 
    });

    afterAll(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected');
    });

    it('should retrieve transactions successfully for a valid user ID and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/transaction/user/11') // Assume userID x has transactions
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Get Transactions Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Transactions retrieved successfully',
            data: expect.any(Array),
        });
    });

    // it('should return 404 if no transactions are found for the given user ID', async () => {
    //     const response = await request(app)
    //         .get('/api/v1/transaction/user/11')
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     console.log('No Transactions Found Response:', response.status, response.body);
    //     expect(response.status).toBe(404);
    //     expect(response.body).toMatchObject({
    //         status: 404,
    //         message: 'Transactions not found for this user',
    //     });
    // });

    it('should create a transaction successfully and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "Harry Potter",
                        family_name: "Potter",
                        nationality: "Indonesia",
                        id_number: "1234567890",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01",
                        birth_date: "2000-01-01"
                    },
                ],
                seatSelections: [{ seat_id: 21 }],
                planeId: 1,
            });

        console.log('Create Transaction Response:', response.status, response.body);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Transaction created successfully',
            data: expect.any(Object),
        });

        transactionIdTest = response.body.data.transaction_id;
    });

    it('should return 400 if invalid user data is provided when creating a transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {},
                passengerData: [{
                    title: "Mr",
                    full_name: "Harry Potter",
                    family_name: "Potter",
                    nationality: "Indonesia",
                    id_number: "1234567890",
                    id_issuer: "Indonesia",
                    id_expiry: "2025-01-01",
                    birth_date: "2000-01-01"
                }],
                seatSelections: [{ seat_id: 1 }],
                planeId: 1,
            });

        console.log('Create Transaction Invalid User Data Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid user data provided',
        });
    });

    it('should return 400 if invalid passenger data is provided when creating a transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                passengerData: [], // Invalid
                seatSelections: [{ seat_id: 20 }],
                planeId: 1,
            });
    
        console.log('Create Transaction Invalid Passenger Data Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid passenger data provided',
        });
    });
    
    it('should return 400 if invalid seat selections are provided when creating a transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "Harry Potter",
                        family_name: "Potter",
                        nationality: "Indonesia",
                        id_number: "1234567890",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01",
                        birth_date: "2000-01-01"
                    },
                ],
                seatSelections: [], // Invalid
                planeId: 1,
            });
    
        console.log('Create Transaction Invalid Seat Selections Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid seat selections provided',
        });
    });
    
    it('should return 404 if invalid plane ID is provided when creating a transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "Harry Potter",
                        family_name: "Potter",
                        nationality: "Indonesia",
                        id_number: "1234567890",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01",
                        birth_date: "2000-01-01"
                    },
                ],
                seatSelections: [{ seat_id: 25 }],
                planeId: null, // Invalid
            });
    
        console.log('Create Transaction Invalid Plane ID Response:', response.status, response.body);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Invalid plane ID provided',
        });
    });

    it('should return 409 if one or more selected seats are no longer available', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "Harry Potter",
                        family_name: "Potter",
                        nationality: "Indonesia",
                        id_number: "1234567890",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01",
                        birth_date: "2000-01-01"
                    },
                ],
                seatSelections: [{ seat_id: 1 }], // Assuming seat_id 1 is unavailable
                planeId: 1,
            });
    
        console.log('Create Transaction Seats Unavailable Response:', response.status, response.body);
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            status: 409,
            message: 'One or more selected seats are no longer available',
        });
    });
    
    // it('should return 500 if internal server error occurs during transaction creation', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/transaction')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             userData: { user_id: 1 },
    //             passengerData: [
    //                 {
    //                     title: "Mr",
    //                     full_name: "Harry Potter",
    //                     family_name: "Potter",
    //                     nationality: "Indonesia",
    //                     id_number: "1234567890",
    //                     id_issuer: "Indonesia",
    //                     id_expiry: "2025-01-01",
    //                     birth_date: "2000-01-01"
    //                 },
    //             ],
    //             seatSelections: [{ seat_id: 50 }],
    //             planeId: 1
    //         });
    
    //     console.log('Create Transaction Internal Server Error Response:', response.status, response.body);
    //     expect(response.status).toBe(500);
    //     expect(response.body).toMatchObject({
    //         status: 500,
    //         message: 'Internal server error',
    //     });
    // });
});