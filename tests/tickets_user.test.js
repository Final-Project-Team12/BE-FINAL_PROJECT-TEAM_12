const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

const jwtToken = jwt.sign(
    { user_id: 1, user_email: 'johndoe@example.com', user_role: 'user' },
    process.env.JWT_SECRET || 'jwt-b1n4r14n',
    { expiresIn: '1h' }
);

describe('TicketsController Integration Tests', () => {
    let transactionIdTest;
    let ticketIdTest;

    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');
        transactionIdTest = 1
        ticketIdTest = 1
    });

    afterAll(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected');
    });

    it('should create tickets for a valid transaction and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/ticket')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ transaction_id: transactionIdTest });

        console.log('Create Tickets Response:', response.status, response.body);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Tickets issued successfully',
            data: expect.any(Array),
        });

        if (response.body.data.length > 0) {
            ticketIdTest = response.body.data[0].ticket_details.ticket_id;
        }
    });

    it('should return 500 if internal server error occurs during ticket creation', async () => {
        const response = await request(app)
            .post('/api/v1/ticket')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ transaction_id: 'invalid_id' });

        console.log('Create Tickets Internal Server Error Response:', response.status, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            status: 500,
            message: 'Internal server error',
        });
    });

    it('should update a ticket and return 200', async () => {
        const response = await request(app)
            .put(`/api/v1/ticket/${ticketIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                seat_id: 2,
                plane_id: 1,
                passenger_id: 2
            });

        console.log('Update Ticket Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Ticket updated successfully',
            data: expect.objectContaining({
                ticket_id: ticketIdTest,
            }),
        });
    });

    it('should return 500 if internal server error occurs during ticket update', async () => {
        const response = await request(app)
            .put('/api/v1/ticket/invalid_id') 
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ seat_id: 2 });

        console.log('Update Ticket Internal Server Error Response:', response.status, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            status: 500,
            message: 'Internal server error',
        });
    });

    it('should delete a ticket and return 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/ticket/${ticketIdTest}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Delete Ticket Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Ticket deleted successfully',
        });
    });

    it('should return 500 if internal server error occurs during ticket deletion', async () => {
        const response = await request(app)
            .delete('/api/v1/ticket/invalid_id') 
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Delete Ticket Internal Server Error Response:', response.status, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            status: 500,
            message: 'Internal server error',
        });
    });
});