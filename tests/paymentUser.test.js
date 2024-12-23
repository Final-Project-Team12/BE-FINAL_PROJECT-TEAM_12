const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();
const jwtToken = jwt.sign(
    { user_id: 1, user_email: 'testuser@example.com', user_role: 'user' },
    process.env.JWT_SECRET || 'jwt-secret',
    { expiresIn: '1h' }
);

describe('PaymentController Integration Tests', () => {
    let orderIdTest;

    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');
        orderIdTest = 'TEST_ORDER_' + Date.now();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected');
    });

    it('should create a payment successfully and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/payments')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                orderId: "hb20fw",
                amount: 1000000,
                customerDetails: {
                    name: 'apip',
                    email: 'anaufal374@gmail.com',
                    mobile_number: '"12321312323"',
                    address: '"Jl. Kenangan"'
                },
                productDetails: [
                    {
                        productId: '11',
                        productName: 'Flight Ticket Australia-South Africa',
                        price: 1000000,
                        quantity: 1
                    }
                ]
            });

        console.log('Create Payment Response:', response.body);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Payment initiated successfully',
            data: {
                payment: expect.any(Object),
                token: expect.any(String),
                redirectUrl: expect.any(String)
            }
        });
    });

    it('should return 400 for missing required fields during payment creation', async () => {
        const response = await request(app)
            .post('/api/v1/payments')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                orderId: '',
                amount: 0, // Invalid amount
                customerDetails: {
                    name: '',
                    email: '',
                    mobile_number: '',
                    address: '123 Test Street'
                },
                productDetails: []
            });

        console.log('Missing Fields Response:', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Missing required fields'
        });
    });

    it('should return 404 when user is not found', async () => {
        const response = await request(app)
            .post('/api/v1/payments')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                orderId: 'TEST_ORDER_3',
                amount: 100000,
                customerDetails: {
                    name: 'Nonexistent User',
                    email: 'nonexistent@example.com', // Email yang tidak ada
                    mobile_number: '081122334455',
                    address: '123 Nonexistent Street'
                },
                productDetails: [
                    {
                        productId: 'TICKET-11',
                        productName: 'Flight Ticket',
                        price: 100000,
                        quantity: 1
                    }
                ]
            });
    
        console.log('Response when user is not found:', response.body);
    
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'User not found with provided email or phone number'
        });
    });

    it('should return 409 when order ID already exists', async () => {
        const existingOrderId = 'TEST_ORDER_4';
    
        const response = await request(app)
            .post('/api/v1/payments')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                orderId: existingOrderId,
                amount: 100000,
                customerDetails: {
                    name: 'Test User',
                    email: 'testuser@example.com',
                    mobile_number: '081122334455',
                    address: '123 Test Street'
                },
                productDetails: [
                    {
                        productId: 'TICKET-11',
                        productName: 'Flight Ticket',
                        price: 100000,
                        quantity: 1
                    }
                ]
            });
    
        console.log('Response when order ID already exists:', response.body);
    
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            status: 409,
            message: `Payment with orderId ${existingOrderId} already exists`
        });
    });

    // it('should throw TRANSACTION_NOT_FOUND error when no pending transaction is found', async () => {
    //     const orderId = 'asdsamdosama123932'; //
    //     const amount = 100000;
    //     const customerDetails = {
    //         name: 'Existing User',
    //         email: 'existinguser@example.com', 
    //         mobile_number: '081234567890',
    //         address: 'Test Address',
    //     };
    //     const productDetails = [
    //         {
    //             productId: 'TICKET001',
    //             productName: 'Test Flight Ticket',
    //             price: 100000,
    //             quantity: 1,
    //         },
    //     ];

    //     await expect(
    //         createPayment(orderId, amount, customerDetails, productDetails)
    //     ).rejects.toThrow('TRANSACTION_NOT_FOUND');
    // });

    // it('should return 400 when amount is less than or equal to 0', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/payments')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             orderId: 'TEST_ORDER_5',
    //             amount: 0, // Amount invalid
    //             customerDetails: {
    //                 name: 'Test User',
    //                 email: 'testuser@example.com',
    //                 mobile_number: '081122334455',
    //                 address: '123 Test Street'
    //             },
    //             productDetails: [
    //                 {
    //                     productId: 'TICKET-11',
    //                     productName: 'Flight Ticket',
    //                     price: 0, // Invalid
    //                     quantity: 1
    //                 }
    //             ]
    //         });
    
    //     console.log('Response when amount is invalid:', response.body);
    
    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Payment validation failed: Amount must be greater than 0'
    //     });
    // });

    // it('should cancel a payment successfully and return 200', async () => {
    //     const response = await request(app)
    //         .post(`/api/v1/payments/${orderIdTest}/cancel`)
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     console.log('Cancel Payment Response:', response.body);

    //     expect(response.status).toBe(200);
    //     expect(response.body).toMatchObject({
    //         status: 200,
    //         message: 'Payment cancelled successfully',
    //         data: expect.any(Object)
    //     });
    // });

    // it('should return 400 when order ID is not provided', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/payments//cancel')
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     console.log('Response when order ID is missing:', response.body);

    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Order ID is required'
    //     });
    // });

    it('should return 404 when payment is not found while canceling payment', async () => {
        const response = await request(app)
            .post('/api/v1/payments/12312312321321/cancel')
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Response when payment is not found:', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Payment not found'
        });
    });

    // it('should return 400 when payment cannot be cancelled', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/payments/ORDER_ID_SETTLED/cancel') 
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     console.log('Response when payment cannot be cancelled:', response.body);

    //     // Validasi respons
    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Cannot cancel payment with status: SETTLEMENT'
    //     });
    // });

    it('should return 404 when cancelling a non-existent payment', async () => {
        const response = await request(app)
            .post(`/api/v1/payments/INVALID_ORDER_ID/cancel`)
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Cancel Non-existent Payment Response:', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Payment not found'
        });
    });

    it('should retrieve payment status successfully and return 200', async () => {
        const response = await request(app)
            .get(`/api/v1/payments/${orderIdTest}/status`)
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Get Payment Status Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Payment status retrieved successfully',
            data: expect.any(Object)
        });
    });

    it('should return 404 when retrieving status of a non-existent payment', async () => {
        const response = await request(app)
            .get(`/api/v1/payments/INVALID_ORDER_ID/status`)
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Get Non-existent Payment Status Response:', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Payment not found'
        });
    });

    // it('should return 400 when orderId is not provided', async () => {
    //     const response = await request(app)
    //         .get('/api/v1/payments//status')
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     console.log('Response when orderId is missing:', response.body);

    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Order ID is required'
    //     });
    // });

    it('should return 400 when customer email is missing', async () => {
        const response = await request(app)
            .post('/api/v1/payments')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                orderId: 'TEST_ORDER_1',
                amount: 100000,
                customerDetails: {
                    name: 'Test User',
                    email: '',
                    mobile_number: '081122334455',
                    address: '123 Test Street'
                },
                productDetails: [
                    {
                        productId: 'TICKET-11',
                        productName: 'Flight Ticket',
                        price: 100000,
                        quantity: 1
                    }
                ]
            });
    
        console.log('Response when email is missing:', response.body);
    
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Customer email and mobile number are required'
        });
    });

    it('should return 400 when customer mobile number is missing', async () => {
        const response = await request(app)
            .post('/api/v1/payments')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                orderId: 'TEST_ORDER_1',
                amount: 100000,
                customerDetails: {
                    name: 'Test User',
                    email: 'anaufal374@gmail.com', 
                    mobile_number: '',
                    address: '123 Test Street'
                },
                productDetails: [
                    {
                        productId: 'TICKET-11',
                        productName: 'Flight Ticket',
                        price: 100000,
                        quantity: 1
                    }
                ]
            });
    
        console.log('Response when email is missing:', response.body);
    
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Customer email and mobile number are required'
        });
    });
});