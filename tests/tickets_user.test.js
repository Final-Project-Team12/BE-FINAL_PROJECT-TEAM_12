const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwtToken = jwt.sign(
    { user_id: 11, user_email: 'dummyemail@gmail.com', user_role: 'user' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

describe('TicketsController User Tests', () => {
    let transactionId;

    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');

        // Create dummy user and transaction
        const user = await prisma.users.upsert({
            where: { email: 'dummyemail@gmail.com' },
            update: {},
            create: {
                name: 'Dummy User',
                telephone_number: '0812345678',
                email: 'dummyemail@gmail.com',
                password: 'hashedpassword',
                address: 'Smith Road Number 10',
                gender: 'male',
                identity_number: '127123456789',
                age: 20,
                role: 'user',
                verified: true,
            },
        });

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
                user_id: user.user_id,
            },
        });

        transactionId = transaction.transaction_id;
    });

    afterAll(async () => {
        await prisma.ticket.deleteMany({});
        await prisma.transaction.deleteMany({});
        await prisma.users.deleteMany({ where: { email: 'dummyemail@gmail.com' } });
        await prisma.$disconnect();
    });

    it('should create tickets for a transaction and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/ticket')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ transaction_id: transactionId });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Tickets issued successfully',
            data: expect.arrayContaining([
                {
                    ticket_details: expect.objectContaining({
                        ticket_id: expect.any(Number),
                        passenger_name: expect.any(String),
                        seat_number: expect.any(String),
                        class: expect.any(String),
                        flight_number: expect.any(String),
                        airline: expect.any(String),
                        departure_time: expect.any(String),
                        departure_airport: expect.any(String),
                        arrival_airport: expect.any(String),
                    }),
                    qrCode: expect.any(String),
                },
            ]),
        });
    });

    it('should return 400 when transaction ID is missing in the request', async () => {
        const response = await request(app)
            .post('/api/v1/ticket')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            message: 'Transaction ID is required',
            status: 400,
        });
    });

    it('should return 404 for a non-existing transaction ID', async () => {
        const response = await request(app)
            .post('/api/v1/ticket')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ transaction_id: 9999 }); // Assuming 9999 does not exist

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            message: 'Invalid transaction ID',
            status: 400,
        });
    });

    // FOR INTERNAL SERVER ERROR
    it('should return 500 for an internal server error in POST /api/v1/ticket', async () => {
        jest.spyOn(prisma.ticket, 'createMany').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const response = await request(app)
            .post('/api/v1/ticket')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ transaction_id: transactionId });

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
            status: 500,
        });

        prisma.ticket.createMany.mockRestore();
    });

    it('should return 500 for an internal server error in GET /api/v1/ticket/:transactionId', async () => {
        jest.spyOn(prisma.ticket, 'findMany').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const response = await request(app)
            .get(`/api/v1/ticket/${transactionId}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
            status: 500,
        });

        prisma.ticket.findMany.mockRestore();
    });

    it('should return 500 for an internal server error in PUT /api/v1/ticket/:ticketId', async () => {
        jest.spyOn(prisma.ticket, 'update').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const response = await request(app)
            .put(`/api/v1/ticket/123`) // Assuming 123 ticket ID
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ seat_id: 2 });

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
            status: 500,
        });

        prisma.ticket.update.mockRestore();
    });

    it('should return 500 for an internal server error in DELETE /api/v1/ticket/:ticketId', async () => {
        jest.spyOn(prisma.ticket, 'delete').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });

        const response = await request(app)
            .delete(`/api/v1/ticket/123`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            message: 'Internal server error',
            status: 500,
        });

        prisma.ticket.delete.mockRestore();
    });
});