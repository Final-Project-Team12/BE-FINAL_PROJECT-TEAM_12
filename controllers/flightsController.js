const { parseQueryParams } = require("../middlewares/queryParser");
const { fetchFlights, countFlights } = require("../services/flightService");
const { formatFlights } = require("../helpers/flightFormatter");

class FlightsController {
    static async getFilteredFlights(req, res, next) {
        try {
            const { from, to, departureDate, returnDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, priceSort, departureSort, arrivalSort, durationSort } = parseQueryParams(req.query);

            const [outbound_flights, return_flights, totalOutboundFlights, totalReturnFlights] = await Promise.all([
                fetchFlights({ from, to, departureDate, returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: false, priceSort, departureSort, arrivalSort, durationSort }),
                returnDate ? fetchFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, offset, limitNumber, isReturn: true, priceSort, departureSort, arrivalSort, durationSort }) : [],
                countFlights({ from, to, departureDate, seatClass, continent, facilities, isReturn: false, priceSort, departureSort, arrivalSort, durationSort }),
                returnDate ? countFlights({ from: to, to: from, departureDate: returnDate, seatClass, continent, facilities, isReturn: true, priceSort, departureSort, arrivalSort, durationSort }) : 0
            ]);
            
            
            const [formattedOutboundFlights, formattedReturnFlights] = await Promise.all([
                formatFlights(outbound_flights, seatClass, totalPassengers),
                formatFlights(return_flights, seatClass, totalPassengers)
            ]);
    
            const totalItems = totalOutboundFlights + totalReturnFlights;
            const totalPages = Math.ceil(totalItems / limitNumber); 
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;

        
            const validatedReturnFlights = return_flights.filter(flight => {
                const flightDate = new Date(flight.departure_time).toISOString().split('T')[0];
                return flightDate === returnDate; 
            });
    
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Penerbangan yang tersedia berhasil diambil",
                data: {
                    outbound_flights: formattedOutboundFlights,
                    return_flights: validatedReturnFlights 
                },
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems,
                    limit: limitNumber,
                    hasNextPage,
                    hasPreviousPage
                }
        });
        } catch (error) {
            next(error);
        }
    }    
}

module.exports = FlightsController;