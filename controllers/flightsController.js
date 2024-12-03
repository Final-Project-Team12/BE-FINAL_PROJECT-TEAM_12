const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parseQueryParams(query) {
    const { from, to, departureDate, seatClass, continent, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber; 

    return { from, to, departureDate, seatClass, continent, pageNumber, limitNumber, offset };
}

function buildFilterConditions({ from, to, departureDate, seatClass, continent }) {
    return {
        ...(from && { origin_airport: { airport_code: { equals: from } } }),
        ...(to && { destination_airport: { airport_code: { equals: to } } }),
        ...(departureDate && {
            departure_time: {
                gte: isNaN(new Date(departureDate).getTime()) ? undefined : new Date(departureDate + 'T00:00:00.000Z'),
                lt: isNaN(new Date(departureDate).getTime()) ? undefined : new Date(new Date(departureDate).setDate(new Date(departureDate).getDate() + 1))
            }
        }),
        ...(seatClass && { seats: { some: { class: seatClass } } }),
        ...(continent && { destination_airport: { continent: { name: continent } } })
    };
}

function formatFlights(flights, seatClass) {
    return flights.map(flight => {
        if (!seatClass) {
            const availableSeats = flight.seats?.filter(seat => seat.price);
            const startFrom = availableSeats?.length > 0 ? Math.min(...availableSeats.map(seat => seat.price)) : null;

            flight.seats_detail = [{ start_from: startFrom }];
        } else {
            const uniqueSeats = [...new Map(flight.seats?.map(seat => [seat.class, seat])).values()];
            flight.seats_detail = uniqueSeats.map(seat => ({
                class: seat.class,
                price: seat.price
            }));
        }

        const { seats, ...rest } = flight;
        return {
            ...rest,
            seats_detail: flight.seats_detail
        };
    });
}

class TicketListingController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { from, to, departureDate, seatClass, continent, pageNumber, limitNumber, offset } =
                parseQueryParams(req.query);
            const whereConditions = buildFilterConditions({ from, to, departureDate, seatClass, continent });

            const [flights, totalItems] = await Promise.all([
                prisma.Plane.findMany({
                    where: whereConditions,
                    include: {
                        airline: true,
                        origin_airport: { include: { continent: true } },
                        destination_airport: { include: { continent: true } },
                        seats: seatClass
                            ? { where: { class: seatClass }, select: { class: true, price: true } }
                            : { select: { price: true } }
                    },
                    skip: offset,
                    take: limitNumber
                }),
                prisma.Plane.count({ where: whereConditions })
            ]);

            const formattedFlights = formatFlights(flights, seatClass);

            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Available flights fetched successfully",
                data: formattedFlights,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalItems / limitNumber),
                    totalItems,
                    limit: limitNumber,
                    hasNextPage: pageNumber < Math.ceil(totalItems / limitNumber),
                    hasPreviousPage: pageNumber > 1
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TicketListingController;
