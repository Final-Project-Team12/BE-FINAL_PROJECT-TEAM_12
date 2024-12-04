const { PrismaClient } = require("@prisma/client");
const { buildFilterConditions } = require("../helpers/filterBuilder");
const prisma = new PrismaClient();

async function fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn, min_price }) {
    const whereConditions = buildFilterConditions({ from, to, departureDate, seatClass, continent, returnDate, facilities, isReturn });

    const planesWithSeats = await prisma.Plane.findMany({
        where: whereConditions,
        include: {
            airline: true,
            origin_airport: { include: { continent: true } },
            destination_airport: { include: { continent: true } },
            seats: {
                where: seatClass ? { class: seatClass } : undefined,
                select: { class: true, price: true }
            }
        },
        skip: offset,
        take: limitNumber
    });

    if (min_price === 'Cheapest') {
        planesWithSeats.sort((a, b) => {
            const aPrice = Math.min(...a.seats.map(seat => seat.price));
            const bPrice = Math.min(...b.seats.map(seat => seat.price));
            return aPrice - bPrice;
        });
    }

    return planesWithSeats;
}

module.exports = { fetchFlights };
