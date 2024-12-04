const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parseQueryParams(query) {
    const { from, to, departureDate, returnDate, seatClass, continent, facilities, passengerAdult = 0, passengerChild = 0, passengerInfant = 0, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, price } = query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    return { from, to, departureDate, returnDate, seatClass, continent, facilities, totalPassengers: parseInt(passengerAdult, 10) + parseInt(passengerChild, 10), pageNumber, limitNumber, offset, price };
}

function buildFilterConditions({ from, to, departureDate, seatClass, continent, returnDate, isReturn = false, facilities }) {
    const parseDate = (date) => isNaN(new Date(date).getTime()) ? undefined : new Date(date + 'T00:00:00.000Z');
    const endOfDay = (date) => date ? new Date(new Date(date).setDate(new Date(date).getDate() + 1)) : undefined;

    const facilitiesMapping = {
        powerOutlets: { power_outlets: true },
        wifiAvailable: { wifi_available: true },
        mealAvailable: { meal_available: true }
    };

    const facilitiesFilters = facilities ? facilities.split(',').reduce((acc, facility) => facilitiesMapping[facility] ? { ...acc, ...facilitiesMapping[facility] } : acc, {}) : {};

    return {
        ...(from && { origin_airport: { airport_code: from } }),
        ...(to && { destination_airport: { airport_code: to } }),
        ...(departureDate && !isReturn && { departure_time: { gte: parseDate(departureDate), lt: endOfDay(departureDate) } }),
        ...(returnDate && isReturn && { departure_time: { gte: parseDate(returnDate), lt: endOfDay(returnDate) } }),
        ...(seatClass && { seats: { some: { class: seatClass } } }),
        ...(continent && { destination_airport: { continent: { name: continent } } }),
        ...facilitiesFilters
    };
}

async function calculateAvailableSeats(planeId, seatClass) {
    const totalSeats = await prisma.Seat.count({ where: { plane_id: planeId, class: seatClass } });
    const bookedSeats = await prisma.Seat.count({ where: { plane_id: planeId, class: seatClass, tickets: { some: {} } } });
    return totalSeats - bookedSeats;
}

async function formatFlights(flights, seatClass, totalPassengers) {
    return Promise.all(flights.map(async (flight) => {
        const seatDetails = await Promise.all(
            [...new Map(flight.seats?.map(seat => [seat.class, seat])).values()].map(async (seat) => {
                const availableSeats = await calculateAvailableSeats(flight.plane_id, seat.class);
                return { class: seat.class, price: Math.min(...flight.seats.filter(s => s.class === seat.class).map(s => s.price)), available_seats: availableSeats };
            })
        );

        const availableSeatsForClass = seatDetails.find(seat => seat.class === seatClass)?.available_seats || 0;
        if (availableSeatsForClass >= totalPassengers) {
            const { seats, ...rest } = flight;
            return { ...rest, seats_detail: seatDetails };
        }
        return null;
    }));
}

async function fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn, price }) {
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

    if (price === "Cheapest") {
        const filteredPlanes = planesWithSeats
            .map(plane => {
                const relevantSeats = seatClass
                    ? plane.seats.filter(seat => seat.class === seatClass)
                    : plane.seats;
                const minPrice = relevantSeats.length > 0
                    ? Math.min(...relevantSeats.map(seat => seat.price))
                    : null;

                return minPrice !== null ? { ...plane, minPrice } : null;
            })
            .filter(plane => plane !== null);

        filteredPlanes.sort((a, b) => a.minPrice - b.minPrice);

        return filteredPlanes;
    }

    return planesWithSeats;
}

class TicketListingController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { from, to, departureDate, returnDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, price } = parseQueryParams(req.query);

            const [outbound_flights, return_flights] = await Promise.all([
                fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: false, price }),
                returnDate ? fetchFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: true, price }) : []
            ]);

            const [formattedOutboundFlights, formattedReturnFlights] = await Promise.all([
                formatFlights(outbound_flights, seatClass, totalPassengers),
                formatFlights(return_flights, seatClass, totalPassengers)
            ]);

            const totalItems = outbound_flights.length + return_flights.length;
            const totalPages = Math.ceil(totalItems / limitNumber);
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;

            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Available flights fetched successfully",
                data: { outbound_flights: formattedOutboundFlights, return_flights: formattedReturnFlights },
                pagination: { currentPage: pageNumber, totalPages, totalItems, limit: limitNumber, hasNextPage, hasPreviousPage }
            });
        } catch (error) {
            console.error("Error fetching flights:", error);
            next(error);
        }
    }
}

module.exports = TicketListingController;
