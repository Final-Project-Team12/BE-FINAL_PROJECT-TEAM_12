const request = require('supertest');
const app = require('../app');
const transactionsService = require('../services/transactionsService');
const { PrismaClient } = require('@prisma/client');

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

const jwtToken = jwt.sign(
    { user_id: 10, user_email: 'user10@example.com', user_role: 'admin' },
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
        console.log('Cleaning up test data...');
        await prisma.seat.updateMany({
            data: {
                is_available: true,
                version: 0
            }
        });
        await prisma.$disconnect();
        console.log('Database disconnected');
    });

    it('should retrieve transactions successfully for a valid user ID and return 200', async () => {
        const response = await request(app)
            .get('/api/v1/transaction/user/10')
            .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Get Transactions Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 200,
            message: 'Transactions retrieved successfully',
            data: expect.any(Array),
        });
    });

    it('should create a transaction successfully and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: false
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

    it('should return 500 if invalid seat selections are provided when creating a transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: null,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: false
            });
    
        console.log('Create Transaction Invalid Seat Selections Response:', response.status, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
            status: 500,
            message: 'Internal server error',
        });
    });    

    it('should return 409 if one or more selected seats are no longer available', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: false
            });
    
        console.log('Create Transaction Seats Unavailable Response:', response.status, response.body);
        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            status: 409,
            message: 'One or more selected seats are no longer available',
        });
    });

    it('should return 404 if the plane is not found while creating transactions', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 9999999,
            });
    
        console.log('Plane Not Found Response:', response.status, response.body);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Selected plane not found',
        });
    });
    
    it('should create a roundtrip transaction successfully and return 201', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1356,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: true,
                returnPlaneId: 20,
                returnSeatSelections: [{ seat_id: 1424}]
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

    it('should return 400 if return flight details are missing for a roundtrip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: true
            });

        console.log('Create Roundtrip Transaction Missing Return Flight Response:', response.status, response.body);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 400,
            message: 'Return flight details are required for round trip'
        });
    });

    it('should return 400 if invalid passenger data is provided in a round trip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: true,
                returnPlaneId: 20,
                returnSeatSelections: [{ seat_id: 1424}]
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
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [],
                planeId: 19,
                isRoundTrip: true,
                returnPlaneId: 20,
                returnSeatSelections: []
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
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: null,
                isRoundTrip: true,
                returnPlaneId: 20,
                returnSeatSelections: [{ seat_id: 1424}]
            });

        console.log('Invalid Plane ID Response:', response.status, response.body);
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 404,
            message: 'Invalid plane ID provided',
        });
    });

    it('should return 404 if the plane is not found in a round trip transaction', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 9999999,
                isRoundTrip: true,
                returnPlaneId: 999999,
                returnSeatSelections: [{ seat_id: 1424}]
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
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: true,
                returnPlaneId: 19,
                returnSeatSelections: [{ seat_id: 1353}]
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
                userData: {
                    user_id: 10,
                    name: "John Doe",
                    email: "keiwahyu19@gmail.com",
                    telephone_number: "0812345678"
                },
                passengerData: [
                    {
                        title: "Mr",
                        full_name: "John Doe",
                        family_name: "Doe",
                        birth_date: "1990-01-01",
                        nationality: "Indonesian",
                        id_number: "127123456789",
                        id_issuer: "Indonesia",
                        id_expiry: "2025-01-01"
                    }
                ],
                seatSelections: [
                    {
                        seat_id: 1355,
                        seat_number: "1A",
                        class: "Economy",
                        price: 6000000
                    }
                ],
                planeId: 19,
                isRoundTrip: true,
                returnPlaneId: 21,
                returnSeatSelections: [{ seat_id: 1495}]
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
    //                 userData: {
    //                     user_id: 11,
    //                     name: "John Doe",
    //                     email: "keiwahyu19@gmail.com",
    //                     telephone_number: "0812345678"
    //                 },
    //                 passengerData: [
    //                     {
    //                         title: "Mr",
    //                         full_name: "John Doe",
    //                         family_name: "Doe",
    //                         birth_date: "1990-01-01",
    //                         nationality: "Indonesian",
    //                         id_number: "127123456789",
    //                         id_issuer: "Indonesia",
    //                         id_expiry: "2025-01-01"
    //                     }
    //                 ],
    //                 seatSelections: [
    //                     {
    //                         seat_id: 1360,
    //                         seat_number: "1A",
    //                         class: "Economy",
    //                         price: 6000000
    //                     }
    //                 ],
    //                 planeId: 19,
    //                 isRoundTrip: true,
    //                 returnPlaneId: 20,
    //                 returnSeatSelections: [{ seat_id: 1426}]
    //         });
    
    //     console.log('Invalid Return Flight Response:', response.status, response.body);
    //     expect(response.status).toBe(400);
    //     expect(response.body).toMatchObject({
    //         status: 400,
    //         message: 'Invalid return flight details',
    //     });
    // });

    it('Should group related transactions as round trip transactions', async () => {
        const mockTransactions = [
            {
                transaction_id: 110,
                trip_type: "outbound",
                related_transaction_id: null,
            },
            {
                transaction_id: 109,
                trip_type: "return",
                related_transaction_id: 110,
            }
        ];
    
        jest.spyOn(transactionsService, 'getTransactionsByUserId').mockResolvedValueOnce(mockTransactions);

        const response = await request(app)
        .get('/api/v1/transaction/user/11')
        .set('Authorization', `Bearer ${jwtToken}`);

        console.log('Grouped Transactions Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([
            {
                type: "round",
                outbound: {
                    transaction_id: 110,
                    trip_type: "outbound",
                    related_transaction_id: null,
                },
                return: {
                    transaction_id: 109,
                    trip_type: "return",
                    related_transaction_id: 110,
                }
            }
        ]);
    })

    it('should handle outbound trip type correctly', async () => {
        const mockTransactions = [
            {
                transaction_id: 72,
                trip_type: "outbound",
                related_transaction_id: null,
            }
        ];
    
        jest.spyOn(transactionsService, 'getTransactionsByUserId').mockResolvedValueOnce(mockTransactions);
    
        const response = await request(app)
            .get('/api/v1/transaction/user/11')
            .set('Authorization', `Bearer ${jwtToken}`);
    
        console.log('Outbound Transactions Response:', response.body);
    
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([
            {
                type: "round",
                outbound: {
                    transaction_id: 72,
                    trip_type: "outbound",
                    related_transaction_id: null,
                },
                return: undefined,
            }
        ]);
    });

    it("should update transaction successfully and return 200", async () => {
        const mockTransactionId = 104;
        const mockUpdateData = {
          status: "SUCCESS",
          message: "Transaction updated successfully",
        };
        const mockUpdatedTransaction = {
          transaction_id: mockTransactionId,
          status: "SUCCESS",
          message: "Transaction updated successfully",
        };
    
        jest.spyOn(transactionsService, "updateTransaction").mockResolvedValueOnce(mockUpdatedTransaction);
    
        const response = await request(app)
          .put(`/api/v1/transaction/${mockTransactionId}`)
          .set("Authorization", `Bearer ${jwtToken}`)
          .send(mockUpdateData);
    
        console.log("Update Transaction Response:", response.body);
    
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          status: 200,
          message: "Transaction updated successfully",
          data: mockUpdatedTransaction,
        });
    });


});