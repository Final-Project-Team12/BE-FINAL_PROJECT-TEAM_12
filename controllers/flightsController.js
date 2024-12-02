const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//STOPPPP
class TicketListingController {
    static async getFilteredFlights(req, res, next) {
        try {
            const {
                filter,
                search,
                page = 1,
                limit = 20,
                from,
                to,
                departureDate,
                returnDate,
                passengers,
                seatClass
            } = req.query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const offset = (pageNumber - 1) * limitNumber;

            let flights;
            let totalItems;

            if (filter === "favorite-airlines") {
                const [favoriteAirline] = await prisma.Airline.findMany({
                    orderBy: {
                        times_used: 'desc'
                    },
                    take: 1
                });

                if (!favoriteAirline) {
                    return res.status(404).json({
                        status: "Not Found",
                        message: "No favorite airline found",
                        data: [],
                        pagination: {
                            currentPage: pageNumber,
                            totalPages: 1,
                            totalItems: 0,
                            pageSize: limitNumber,
                            hasNextPage: false,
                            hasPreviousPage: false
                        }
                    });
                }

                flights = await prisma.Plane.findMany({
                    where: {
                        airline: {
                            airline_name: favoriteAirline.airline_name
                        },
                        seats: { some: {} }
                    },
                    include: {
                        airline: true,
                        origin_airport: {
                            include: {
                                continent: true 
                            }
                        },
                        destination_airport: {
                            include: {
                                continent: true 
                            }
                        },
                        seats: true
                    },
                    orderBy: { departure_time: "asc" },
                    skip: offset,
                    take: limitNumber
                });

                totalItems = await prisma.Plane.count({
                    where: {
                        airline: {
                            airline_name: favoriteAirline.airline_name
                        },
                        seats: { some: {} }
                    }
                });
            } 

            else if (filter && ["asia", "amerika", "afrika", "eropa", "australia", "antartika"].includes(filter.toLowerCase())) {
                const continentName = filter.toLowerCase();
                
                const continent = await prisma.Continent.findFirst({
                    where: {
                        name: {
                            equals: continentName,
                            mode: 'insensitive'
                        }
                    },
                    include: {
                        airports: {
                            select: {
                                airport_id: true,
                                name: true,
                                times_visited: true,
                                continent_id: true
                            }
                        }
                    }
                });
                
                if (!continent) {
                    return res.status(404).json({
                        status: "Not Found",
                        message: `Continent ${continentName} not found`,
                        data: []
                    });
                }
                
                const airportsSortedByVisit = continent.airports.sort((a, b) => b.times_visited - a.times_visited);
                const topAirport = airportsSortedByVisit[0];
                
                if (!topAirport) {
                    return res.status(404).json({
                        status: "Not Found",
                        message: "No airports found in the selected continent",
                        data: []
                    });
                }
                
                flights = await prisma.Plane.findMany({
                    where: {
                        destination_airport: {
                            airport_id: topAirport.airport_id
                        }
                    },
                    include: {
                        airline: true,
                        origin_airport: true,
                        destination_airport: true,
                        seats: true
                    },
                    orderBy: { departure_time: "asc" },
                    skip: offset,
                    take: limitNumber
                });
                
                totalItems = await prisma.Plane.count({
                    where: {
                        destination_airport: {
                            airport_id: topAirport.airport_id
                        }
                    }
                });
            }
            
            else if (search || from || to || departureDate || returnDate) {
                const baseWhere = {
                    ...(from && { origin_airport: { airport_code: { equals: from } } }),
                    ...(to && { destination_airport: { airport_code: { equals: to } } }),
                    ...(departureDate && {
                        departure_time: {
                            gte: isNaN(new Date(departureDate).getTime()) ? undefined : new Date(departureDate + 'T00:00:00.000Z'),
                            lt: isNaN(new Date(departureDate).getTime()) ? undefined : new Date(new Date(departureDate).setDate(new Date(departureDate).getDate() + 1))
                        }
                    }),
                    ...(returnDate && {
                        return_time: {
                            gte: isNaN(new Date(returnDate).getTime()) ? undefined : new Date(returnDate + 'T00:00:00.000Z'),
                            lt: isNaN(new Date(returnDate).getTime()) ? undefined : new Date(new Date(returnDate).setDate(new Date(returnDate).getDate() + 1))
                        }
                    })
                };

                if (search) {
                    baseWhere.OR = [
                        { plane_code: { contains: search, mode: "insensitive" } },
                        { airline: { airline_name: { contains: search, mode: "insensitive" } } },
                        { origin_airport: { name: { contains: search, mode: "insensitive" } } },
                        { destination_airport: { name: { contains: search, mode: "insensitive" } } }
                    ];
                }

                totalItems = await prisma.Plane.count({ where: baseWhere });

                flights = await prisma.Plane.findMany({
                    where: baseWhere,
                    include: {
                        airline: true,
                        origin_airport: { include: { continent: true } },
                        destination_airport: { include: { continent: true } },
                        seats: true
                    },
                    orderBy: { departure_time: "asc" },
                    skip: offset,
                    take: limitNumber
                });
            }

            
            else {
                totalItems = await prisma.Plane.count({
                    where: {
                        seats: { some: {} }
                    }
                });

                flights = await prisma.Plane.findMany({
                    where: {
                        seats: { some: {} }
                    },
                    include: {
                        airline: true,
                        origin_airport: {
                            include: {
                                continent: true 
                            }
                        },
                        destination_airport: {
                            include: {
                                continent: true 
                            }
                        },
                        seats: true
                    },
                    orderBy: { departure_time: "asc" },
                    skip: offset,
                    take: limitNumber
                });
            }

            const sanitizedFlights = flights.map(flight => {
                const departureTime = new Date(flight.departure_time);
                const arrivalTime = new Date(flight.arrival_time);
                const travelDuration = Math.floor((arrivalTime - departureTime) / (1000 * 60));

                const originAirport = flight.origin_airport || {};
                const destinationAirport = flight.destination_airport || {};

                return {
                    plane_id: flight.plane_id,
                    plane_code: flight.plane_code,
                    departure_time: flight.departure_time,
                    arrival_time: flight.arrival_time,
                    travel_duration: travelDuration,
                    airline_name: flight.airline.airline_name,
                    airline_code: flight.airline.airline_code,
                    available_seats: flight.seats.length,
                    origin_airport: {
                        airport_id: originAirport.airport_id || null,
                        airport_name: originAirport.name || 'N/A',
                        airport_address: originAirport.address || 'N/A',
                        airport_code: originAirport.airport_code || 'N/A',
                        times_visited: originAirport.times_visited || 0,
                        continent: originAirport.continent ? originAirport.continent.name : 'N/A'
                    },
                    destination_airport: {
                        airport_id: destinationAirport.airport_id || null,
                        airport_name: destinationAirport.name || 'N/A',
                        airport_address: destinationAirport.address || 'N/A',
                        airport_code: destinationAirport.airport_code || 'N/A',
                        times_visited: destinationAirport.times_visited || 0,
                        continent: destinationAirport.continent ? destinationAirport.continent.name : 'N/A'
                    }
                };
            });

            const totalPages = Math.ceil(totalItems / limitNumber);
            const hasNextPage = pageNumber < totalPages;
            const hasPreviousPage = pageNumber > 1;

            return res.status(200).json({
                status: "Success",
                message: "Available flights fetched successfully",
                data: sanitizedFlights,
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

module.exports = TicketListingController;
