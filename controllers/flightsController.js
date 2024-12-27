const { parseQueryParams } = require("../utils/queryParser");
const { fetchFlights, countFlights } = require("../services/flightService");
const { formatFlights } = require("../utils/flightFormatter");

class FlightsController {
    static async getFlights(req, res, next) {
        try {
            const queryParams = parseQueryParams(req.query);

            const { from, to, departureDate, seatClass, continent, facilities, pageNumber, limitNumber, offset, totalPassengers, priceSort, departureSort, arrivalSort, durationSort, minPrice, maxPrice } = queryParams;

            const [outbound_flights, totalOutboundFlights] = await Promise.all([
                fetchFlights({ from: null, to: null, departureDate: null, seatClass: null, continent, facilities: null, offset, limitNumber, isReturn: false, priceSort: null, departureSort: null, arrivalSort: null, durationSort: null, minPrice: null, maxPrice }),
                countFlights({ from: null, to: null, departureDate: null, seatClass: null, continent, facilities: null, isReturn: false, priceSort: null, departureSort: null, arrivalSort: null, durationSort: null, minPrice, maxPrice })
            ]);

            const formattedOutboundFlights = await formatFlights(outbound_flights, seatClass, totalPassengers);

            const totalPages = Math.ceil(totalOutboundFlights / limitNumber);
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;
            
            /* istanbul ignore next */
            if (!formattedOutboundFlights.length) {
                /* istanbul ignore next */
                return res.status(404).json({
                    status: 404,
                    message: "No outbound flights found for the specified route.",
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
                status: 200,
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
            /* istanbul ignore next */
            next(error);
        }
    }

    static async searchFilteredFlights(req, res, next) {
        try {
            const queryParams = parseQueryParams(req.query);
    
            if (queryParams.status && queryParams.status === 400) {
                return res.status(queryParams.status).json(queryParams);
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
    
            const validOutboundFlights = formattedOutboundFlights.filter(flight => flight.seats_detail && flight.seats_detail.length > 0);
            const validReturnFlights = formattedReturnFlights.filter(flight => flight.seats_detail && flight.seats_detail.length > 0);
    
            const totalOutboundPages = Math.ceil(validOutboundFlights.length / limitNumber);
            const totalReturnPages = Math.ceil(validReturnFlights.length / limitNumber);
    
            const totalPages = Math.max(totalOutboundPages, totalReturnPages);
    
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;
            
            if (!validOutboundFlights.length && !validReturnFlights.length) {
                /* istanbul ignore next */
                return res.status(404).json({
                    status: 404,
                    message: "No flights found for the specified filters.",
                    data: {
                        outbound_flights: [],
                        return_flights: []
                    },
                    pagination: {
                        currentPage: pageNumber,
                        totalPages,
                        totalItems: validOutboundFlights.length + validReturnFlights.length,
                        limit: limitNumber,
                        hasNextPage,
                        hasPreviousPage
                    }
                });
            }
    
            const responseData = {
                outbound_flights: departureDate ? validOutboundFlights : [],
                return_flights: returnDate ? validReturnFlights : []
            };
    
            return res.status(200).json({
                status: 200,
                message: "Available flights have been successfully retrieved.",
                data: responseData,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems: validOutboundFlights.length + validReturnFlights.length,
                    limit: limitNumber,
                    hasNextPage,
                    hasPreviousPage
                }
            });
        } catch (error) {
            /* istanbul ignore next */
            next(error);
        }
    }
    
    
}

module.exports = FlightsController;
