const { parseQueryParams } = require("../utils/queryParser");
const { fetchFlights, countFlights } = require("../services/flightService");
const { formatFlights } = require("../utils/flightFormatter");

class FlightsController {
    static async getFlights(req, res, next) {
        try {
            const queryParams = parseQueryParams(req.query);

            if (queryParams.status === "Error") {
                return res.status(queryParams.statusCode).json(queryParams);
            }

            const { from, to, departureDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice } = queryParams;

            const [outbound_flights, totalOutboundFlights] = await Promise.all([
                fetchFlights({ from: null, to: null, departureDate: null, seatClass: null, continent, facilities: null, offset, limitNumber, isReturn: false, priceSort: null, departureSort: null, arrivalSort: null, durationSort: null, minPrice: null, maxPrice }),
                countFlights({ from: null, to: null, departureDate: null, seatClass: null, continent, facilities: null, isReturn: false, priceSort: null, departureSort: null, arrivalSort: null, durationSort: null, minPrice, maxPrice })
            ]);
            

            const formattedOutboundFlights = await formatFlights(outbound_flights, seatClass, totalPassengers);

            const totalPages = Math.ceil(totalOutboundFlights / limitNumber);
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;

            if (!formattedOutboundFlights.length) {
                return res.status(200).json({
                    status: "success",
                    message: "No flights are available for this route.",
                    data: {
                        outbound_flights: []
                    },
                    pagination: {
                        currentPage: pageNumber,
                        totalPages: 0,
                        totalItems: 0,
                        limit: limitNumber,
                        hasNextPage: false,
                        hasPreviousPage: false
                    }
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Outbound flights have been successfully retrieved.",
                data: {
                    outbound_flights: formattedOutboundFlights
                },
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems: totalOutboundFlights,
                    limit: limitNumber,
                    hasNextPage,
                    hasPreviousPage
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async searchFilteredFlights(req, res, next) {
        try {
            const queryParams = parseQueryParams(req.query);
    
            if (queryParams.status === "Error") {
                return res.status(queryParams.statusCode).json(queryParams);
            }
    
            const { from, to, departureDate, returnDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice } = queryParams;
    
            const [outbound_flights, return_flights, totalOutboundFlights, totalReturnFlights] = await Promise.all([
                fetchFlights({ from, to, departureDate, returnDate, seatClass, continent: null, facilities, offset, limitNumber, isReturn: false, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice }),
                returnDate ? fetchFlights({ from, to, departureDate, returnDate, seatClass, continent: null, facilities, offset, limitNumber, isReturn: true, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice }) : [],
                countFlights({ from, to, departureDate, seatClass, continent: null, facilities, isReturn: false, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice }),
                returnDate ? countFlights({ from, to, departureDate, seatClass, continent: null, facilities, isReturn: true, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice }) : 0
            ]);
    
            const [formattedOutboundFlights, formattedReturnFlights] = await Promise.all([
                formatFlights(outbound_flights, seatClass, totalPassengers),
                formatFlights(return_flights, seatClass, totalPassengers)
            ]);
    
            const totalItems = totalOutboundFlights + totalReturnFlights;
            const totalPages = Math.ceil(totalItems / limitNumber);
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;
    
            const responseData = {
                outbound_flights: departureDate ? formattedOutboundFlights : [],
                return_flights: returnDate ? formattedReturnFlights : []
            };
    
            return res.status(200).json({
                status: "success",
                message: "Available flights have been successfully retrieved.",
                data: responseData,
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
