const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAirport = async (data) => {
    return prisma.airport.create({
        data: data
    });
};

const getAirports = async (page, limit) => {
    const offset = (page - 1) * limit;
    const totalAirports = await prisma.airport.count();
    const totalPages = Math.ceil(totalAirports / limit);

    const airports = await prisma.airport.findMany({
        skip: offset,
        take: limit,
        select: {
            airport_id: true,
            name: true,
            airport_code: true,
            image_url: true,
            times_visited: true
        }
    });

    return {
        airports,
        totalPages,
    };
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
