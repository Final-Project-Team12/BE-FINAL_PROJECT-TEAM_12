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
                seatSelections: [{ seat_id: 20 }],
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
});