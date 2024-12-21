const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const jwtToken = jwt.sign(
    { user_id: 11, user_email: 'dummydata54@gmail.com', user_role: 'admin' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

describe('TransactionsController Admin Tests', () => {
    let transactionId;

    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');

        const transaction = await prisma.transaction.create({
            data: {
                status: 'PENDING',
                redirect_url: '',
                transaction_date: new Date(),
                token: 'dummy_token',
                message: 'Test transaction',
                base_amount: 100,
                tax_amount: 10,
                total_payment: 110,
                user_id: 11,
            },
        });

        transactionId = transaction.transaction_id;
    });

    afterAll(async () => {
        await prisma.ticket.deleteMany({});
        await prisma.transaction.deleteMany({ where: { token: 'dummy_token' } });
        await prisma.$disconnect();
    });

    it('should retrieve transactions by user ID and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/transaction/user/11`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Transactions retrieved successfully',
            data: expect.any(Array),
        });
    });

    it('should create a new transaction and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                passengerData: [
                    {
                        title: 'Mr',
                        full_name: 'John Doe',
                        nationality: 'ID',
                    },
                ],
                seatSelections: [{ seat_id: 1 }],
                planeId: 1,
                isRoundTrip: false,
            });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Transaction created successfully',
            data: expect.any(Object),
        });
    });

    it('should return 404 for a non-existing user ID in GET /api/v1/transaction/user/:userId', async () => {
        const response = await request(app)
            .get(`/api/v1/transaction/user/9999`) // Assuming user_id 9999 does not exist
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            message: 'Transactions not found for this user',
            status: 404,
        });
    });

    it('should update a transaction and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/transaction/${transactionId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ status: 'SUCCESS' });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Transaction updated successfully',
            data: expect.any(Object),
        });
    });

    it('should delete a transaction and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/transaction/${transactionId}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Transaction deleted successfully',
        });
    });

    // Internal Server Error Tests
    it('should return 500 for an internal server error in GET /api/v1/transaction/user/:userId', async () => {
        jest.spyOn(prisma.transaction, 'findMany').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const response = await request(app)
            .get(`/api/v1/transaction/user/11`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
            status: 500,
        });

        prisma.transaction.findMany.mockRestore();
    });

    it('should return 500 for an internal server error in POST /api/v1/transaction', async () => {
        jest.spyOn(prisma.transaction, 'create').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                passengerData: [
                    {
                        title: 'Mr',
                        full_name: 'John Doe',
                        nationality: 'ID',
                    },
                ],
                seatSelections: [{ seat_id: 1 }],
                planeId: 1,
                isRoundTrip: false,
            });

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
            status: 500,
        });

        prisma.transaction.create.mockRestore();
    });
});