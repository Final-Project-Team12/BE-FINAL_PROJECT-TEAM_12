const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSeat(data) {
    return await prisma.seat.create({
        data: { ...data }, // Menggunakan spread operator untuk mengelola data
    });
}

async function getAllSeats() {
    return await prisma.seat.findMany();
}

async function getSeatById(seat_id) {
    return await prisma.seat.findUnique({
        where: { seat_id },
    });
}

async function updateSeat(seat_id, data) {
    return await prisma.seat.update({
        where: { seat_id },
        data: { ...data }, 
    });
}

async function deleteSeat(seat_id) {
    return await prisma.seat.delete({
        where: { seat_id },
    });
}

module.exports = {
    createSeat,
    getAllSeats,
    getSeatById,
    updateSeat,
    deleteSeat,
};
