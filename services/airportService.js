const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAirport = async (data) => {
    return prisma.airport.create({
        data: data
    });
};

const getAirports = async () => {
    return prisma.airport.findMany({
        select: {
            airport_id: true,
            name: true,
            airport_code: true,
            image_url: true,
            times_visited: true
        }
    });
};

const getAirportById = async (airport_id) => {
    return prisma.airport.findUnique({
        where: { airport_id: parseInt(airport_id) }
    });
};

const deleteAirportById = async (airport_id) => {
    return prisma.airport.delete({
        where: { airport_id: parseInt(airport_id) }
    });
};

const updateAirportById = async (airport_id, updateData) => {
    return prisma.airport.update({
        where: { airport_id: parseInt(airport_id) },
        data: updateData
    });
};

module.exports = {
    createAirport,
    getAirports,
    getAirportById,
    deleteAirportById,
    updateAirportById
};
