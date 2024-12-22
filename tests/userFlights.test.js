const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

describe('UserController Integration Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
        console.log('Database connected');
    });

    afterAll(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected');
    });

    //get all flights
    it('should return all flights with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights')
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Outbound flights have been successfully retrieved.');
    }, 20000);

    //get flights by continent
    it('should return all flights with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights')
            .query({
                continent: 'North America'
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Outbound flights have been successfully retrieved.');
    }, 20000);
    //get flights by continent code 500 error
    it('should return all flights with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights')
            .query({
                continent: 'North Carolina'
            })
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    }, 20000);

    //get filtered-search flights
    it('should return a filtered flight with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                minPrice:'50000',
                maxPrice:'7100000',
                facilities:'mealAvailable, wifiAvailable, powerOutlets',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);

    //get sorted flights
    it('should return a sorted flight by cheapest with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                priceSort:'Cheapest',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by most expensive with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                priceSort:'Expensive',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by first departure with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                departureSort:'First',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by latest departure with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                departureSort:'Last',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by first arrival with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                arrivalSort:'First',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by last arrival with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                arrivalSort:'Last',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by longest duration with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                durationSort:'Longest',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);
    it('should return a sorted flight by shortest duration with status code 200', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
                durationSort:'Shortest',
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available flights have been successfully retrieved.');
    }, 20000);


    //error handling tests
    it('should return an error message minPrice with status code 400', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                minPrice:'asdads',
                maxPrice:'7100000',
                facilities:'mealAvailable, wifiAvailable, powerOutlets',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('The parameter minPrice must be a number.');
    }, 20000);
    it('should return an error message maxPrice with status code 400', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                minPrice:'10000',
                maxPrice:'asdasd',
                facilities:'mealAvailable, wifiAvailable, powerOutlets',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('The parameter maxPrice must be a number.');
    }, 20000);
    it('should return an error message minPrice-maxPrice with status code 400', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                passengerAdult:'2',
                minPrice:'1000000',
                maxPrice:'100000',
                facilities:'mealAvailable, wifiAvailable, powerOutlets',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('The parameter minPrice cannot be greater than maxPrice.');
    }, 20000);
    it('should return an error message infant-adult with status code 400', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-11',
                seatClass:'Economy',
                minPrice:'10000',
                maxPrice:'7100000',
                facilities:'mealAvailable, wifiAvailable, powerOutlets',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Each infant must be accompanied by at least one adult.');
    }, 20000);
    it('should return an error message infant-adult with status code 400', async () => {
        const response = await request(app)
            .get('/api/v1/flights/search')
            .query({
                from:'Uni2',
                to:'Ger3',
                departureDate:'2024-12-07',
                returnDate:'2024-12-06',
                seatClass:'Economy',
                minPrice:'10000',
                maxPrice:'7100000',
                facilities:'mealAvailable, wifiAvailable, powerOutlets',
                passengerAdult:'2',
                passengerInfant:'1',
                passengerChild:'1',
                limit:'10',
                page:'1',
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('The return date must be greater than departure date.');
    }, 20000);
})