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
            .get('/api/v1/transaction/user/11')
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Get Transactions Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Transactions retrieved successfully',
            data: expect.any(Array),
        });
    });

    // it('should return 404 if user is not found', async () => {
    //     const response = await request(app)
    //         .get('/api/v1/transaction/user/999999')
    //         .set('Authorization', `Bearer ${jwtToken}`);
    
    //     console.log('Get Transactions User Not Found Response:', response.status, response.body);
    //     expect(response.status).toBe(404);
    //     expect(response.body).toMatchObject({
    //         status: 404,
    //         message: 'User not found',
    //     });
    // });

    // it('should return 500 if no transactions are found for the given user ID', async () => {
    //     const response = await request(app)
    //         .get('/api/v1/transaction/user/12')
    //         .set('Authorization', `Bearer ${jwtToken}`);

    //     console.log('No Transactions Found Response:', response.status, response.body);
    //     expect(response.status).toBe(500);
    //     expect(response.body).toMatchObject({
    //         status: 500,
    //         message: 'Internal server error',
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
    
    it('should return 500 if invalid seat selections are provided when creating a transaction', async () => {
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
                seatSelections: [{ seat_id: null}], // Invalid
                planeId: 1,
            });
    
        console.log('Create Transaction Invalid Seat Selections Response:', response.status, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            status: 500,
            message: 'Internal server error',
        });
    });

    it('should return 500 if invalid seat selections are provided when creating a transaction', async () => {
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
                seatSelections: [{ seat_id: 99999999}], // Invalid
                planeId: 1,
            });
    
        console.log('Create Transaction Invalid Seat Selections Response:', response.status, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            status: 500,
            message: 'Internal server error',
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

    it('should create a roundtrip transaction successfully and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                isRoundTrip: true,
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
                    }
                ],
                seatSelections: [{ seat_id: 55 }],
                planeId: 1,
                returnPlaneId: 2,
                returnSeatSelections: [{ seat_id: 32, version: 0 }],
                total_payment: 6600000
            });

        console.log('Create Roundtrip Transaction Response:', response.status, response.body);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 201,
            message: 'Round trip transaction created successfully',
            data: {
                outbound: expect.any(Object),
                return: expect.any(Object)
            }
        });
    });

    // it('should return 400 if invalid user data', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/transaction')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             userData: { user_id: 999999 },
    //             isRoundTrip: true,
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
    //                 }
    //             ],
    //             seatSelections: [{ seat_id: 55 }],
    //             planeId: 1,
    //             returnPlaneId: 2,
    //             returnSeatSelections: [{ seat_id: 32, version: 0 }],
    //             total_payment: 6600000
    //         });

    //     console.log('Create Roundtrip Transaction Response:', response.status, response.body);
    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Invalid user data',
    //         data: {
    //             outbound: expect.any(Object),
    //             return: expect.any(Object)
    //         }
    //     });
    // });

    it('should return 400 if return flight details are missing for a roundtrip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                isRoundTrip: true,
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
                    }
                ],
                seatSelections: [{ seat_id: 54 }],
                planeId: 1,
                total_payment: 6600000
            });

        console.log('Create Roundtrip Transaction Missing Return Flight Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Return flight details are required for round trip'
        });
    });

    // it('should return 400 if invalid return flight details are provided', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/transaction')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             userData: { user_id: 11 },
    //             isRoundTrip: true,
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
    //                 }
    //             ],
    //             seatSelections: [{ seat_id: 54 }],
    //             planeId: 1,
    //             returnPlaneId: 4,
    //             returnSeatSelections: [{ seat_id: 30 }],
    //             total_payment: 6600000
    //         });

    //     console.log('Invalid Return Flight Response:', response.status, response.body);
    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Invalid return flight details'
    //     });
    // });

    it('should return 400 if invalid passenger data is provided in a round trip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                isRoundTrip: true,
                passengerData: [],
                seatSelections: [{ seat_id: 20 }],
                planeId: 1,
                returnPlaneId: 2,
                returnSeatSelections: [{ seat_id: 21 }],
            });

        console.log('Invalid Passenger Data Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid passenger data provided',
        });
    });

    it('should return 400 if invalid seat selections are provided in a round trip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                isRoundTrip: true,
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
                seatSelections: [],
                planeId: 1,
                returnPlaneId: 2,
                returnSeatSelections: [{ seat_id: 21 }],
            });

        console.log('Invalid Seat Selections Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid seat selections provided',
        });
    });

    it('should return 404 if an invalid plane ID is provided in a round trip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                isRoundTrip: true,
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
                seatSelections: [{ seat_id: 20 }],
                planeId: null,
                returnPlaneId: 2,
                returnSeatSelections: [{ seat_id: 21 }],
            });

        console.log('Invalid Plane ID Response:', response.status, response.body);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Invalid plane ID provided',
        });
    });

    // it('should return 404 if the user is not found in a round trip transaction', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/transaction')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             userData: { user_id: 999999 },
    //             isRoundTrip: true,
    //             passengerData: [{
    //                 title: "Mr",
    //                 full_name: "Harry Potter",
    //                 family_name: "Potter",
    //                 nationality: "Indonesia",
    //                 id_number: "1234567890",
    //                 id_issuer: "Indonesia",
    //                 id_expiry: "2025-01-01",
    //                 birth_date: "2000-01-01"
    //             }],
    //             seatSelections: [{ seat_id: 20 }],
    //             planeId: 1,
    //             returnPlaneId: 2,
    //             returnSeatSelections: [{ seat_id: 21 }],
    //         });
    
    //     console.log('User Not Found Response:', response.status, response.body);
    //     expect(response.status).toBe(404);
    //     expect(response.body).toMatchObject({
    //         status: 404,
    //         message: 'User not found',
    //     });
    // });

    it('should return 404 if the plane is not found in a round trip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 11 },
                isRoundTrip: true,
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
                seatSelections: [{ seat_id: 20 }], 
                planeId: 999999, 
                returnPlaneId: 888888, 
                returnSeatSelections: [{ seat_id: 21 }],
            });
    
        console.log('Plane Not Found Response:', response.status, response.body);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Selected plane not found',
        });
    });

    it('should return 400 if return flight departure date is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                isRoundTrip: true,
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
                seatSelections: [{ seat_id: 567 }],
                planeId: 4,
                returnPlaneId: 4,
                returnSeatSelections: [{ seat_id: 393 }],
            });
    
        console.log('Invalid Return Flight Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid return flight details',
        });
    });

    it('should return 400 if return flight departure date is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: { user_id: 1 },
                isRoundTrip: true,
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
                seatSelections: [{ seat_id: 567 }],
                planeId: 4,
                returnPlaneId: 7,
                returnSeatSelections: [{ seat_id: 393 }],
            });
    
        console.log('Invalid Return Flight Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Invalid return flight details',
        });
    });

    // it('should return 400 if return flight departure date is invalid', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/transaction')
    //         .set('Authorization', `Bearer ${jwtToken}`)
    //         .send({
    //             userData: { user_id: 1 },
    //             isRoundTrip: true,
    //             passengerData: [{
    //                 title: "Mr",
    //                 full_name: "Harry Potter",
    //                 family_name: "Potter",
    //                 nationality: "Indonesia",
    //                 id_number: "1234567890",
    //                 id_issuer: "Indonesia",
    //                 id_expiry: "2025-01-01",
    //                 birth_date: "2000-01-01"
    //             }],
    //             seatSelections: [{ seat_id: 462 }],
    //             planeId: 4,
    //             returnPlaneId: 3,
    //             returnSeatSelections: [{ seat_id: 302 }],
    //         });
    
    //     console.log('Invalid Return Flight Response:', response.status, response.body);
    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Invalid return flight details',
    //     });
    // });
});