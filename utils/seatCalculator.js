const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function calculateAvailableSeats(planeId, seatClass) {
    const totalSeats = await prisma.Seat.count({ where: { plane_id: planeId, class: seatClass } });
    const bookedSeats = await prisma.Seat.count({ where: { plane_id: planeId, class: seatClass, tickets: { some: {} } } });
    return totalSeats - bookedSeats;
}

module.exports = { calculateAvailableSeats };
