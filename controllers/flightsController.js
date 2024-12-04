const { parseQueryParams } = require("../helpers/queryParser");
const { fetchFlights } = require("../services/flightService");
const { formatFlights } = require("../helpers/flightFormatter");

class FlightsController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { from, to, departureDate, returnDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, min_price } = parseQueryParams(req.query);

            const [outbound_flights, return_flights] = await Promise.all([
                fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: false, min_price }),
                returnDate ? fetchFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: true, min_price }) : []
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
                message: "Penerbangan yang tersedia berhasil diambil",
                data: { outbound_flights: formattedOutboundFlights, return_flights: formattedReturnFlights },
                pagination: { currentPage: pageNumber, totalPages, totalItems, limit: limitNumber, hasNextPage, hasPreviousPage }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FlightsController;
