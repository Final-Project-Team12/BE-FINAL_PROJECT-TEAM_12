const { parseQueryParams } = require("../middlewares/queryParser");
const { fetchFlights, countFlights } = require("../services/flightService");
const { formatFlights } = require("../helpers/flightFormatter");

class FlightsController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { from, to, departureDate, returnDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, min_price } = parseQueryParams(req.query);

            const [outbound_flights, return_flights, totalOutboundFlights, totalReturnFlights] = await Promise.all([
                fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: false, min_price }),
                returnDate ? fetchFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: true, min_price }) : [],
                countFlights({ from, to, departureDate, seatClass, continent, facilities, isReturn: false, min_price }),
                returnDate ? countFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, isReturn: true, min_price }) : 0
            ]);

            const [formattedOutboundFlights, formattedReturnFlights] = await Promise.all([
                formatFlights(outbound_flights, seatClass, totalPassengers),
                formatFlights(return_flights, seatClass, totalPassengers)
            ]);

            const totalItems = totalOutboundFlights + totalReturnFlights;
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