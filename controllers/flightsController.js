const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parseQueryParams(query) {
    const { from, to, departureDate, returnDate, seatClass, continent, facilities, passengerAdult = 0, passengerChild = 0, passengerInfant = 0, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    return { from, to, departureDate, returnDate, seatClass, continent, facilities, totalPassengers: parseInt(passengerAdult, 10) + parseInt(passengerChild, 10), pageNumber, limitNumber, offset };
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

async function fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn }) {
    const whereConditions = buildFilterConditions({ from, to, departureDate, seatClass, continent, returnDate, facilities, isReturn });
    const planes = await prisma.Plane.findMany({
        where: whereConditions,
        include: {
            airline: true,
            origin_airport: { include: { continent: true } },
            destination_airport: { include: { continent: true } },
            seats: seatClass ? { where: { class: seatClass }, select: { class: true, price: true } } : { select: { class: true, price: true } }
        },
        skip: offset,
        take: limitNumber
    });

    if (continent) {
        return planes.filter(plane => plane.destination_airport.continent?.name === continent || plane.origin_airport.continent?.name === continent);
    }
    return planes;
}

class TicketListingController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { from, to, departureDate, returnDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers } = parseQueryParams(req.query);

            const [outboundFlights, returnFlights] = await Promise.all([
                fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: false }),
                returnDate ? fetchFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: true }) : []
            ]);

            const [formattedOutboundFlights, formattedReturnFlights] = await Promise.all([
                formatFlights(outboundFlights, seatClass, totalPassengers),
                formatFlights(returnFlights, seatClass, totalPassengers)
            ]);

            const totalItems = outboundFlights.length + returnFlights.length;
            const totalPages = Math.ceil(totalItems / limitNumber);
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;

            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Available flights fetched successfully",
                data: { outboundFlights: formattedOutboundFlights, returnFlights: formattedReturnFlights },
                pagination: { currentPage: pageNumber, totalPages, totalItems, limit: limitNumber, hasNextPage, hasPreviousPage }
            });
        } catch (error) {
            console.error("Error fetching flights:", error);
            next(error);
        }
    }
}

module.exports = TicketListingController;
