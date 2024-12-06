const { PrismaClient } = require("@prisma/client");
const { buildFilterConditions } = require("../helpers/filterBuilder");
const prisma = new PrismaClient();

async function fetchFlights({
    from,
    to,
    departureDate,
    returnDate,
    seatClass,
    continent,
    facilities,
    offset,
    limitNumber,
    isReturn,
    priceSort,
    departureSort,
    arrivalSort,
    durationSort,
    minPrice,
    maxPrice
}) {
    const whereConditions = buildFilterConditions({ 
        from, 
        to, 
        departureDate, 
        seatClass, 
        continent, 
        returnDate, 
        facilities, 
        isReturn, 
        departureSort, 
        arrivalSort,
        minPrice,  
        maxPrice   
    });

    console.log("Fetching Return Flights with Parameters:", { 
        from: to, 
        to: from,
        departureDate,
        departureDateR: returnDate, 
        isReturn 
    });

    if (continent) {
        const continentData = await getContinentData(continent);
        if (!continentData) {
            throw new Error(`Continent ${continent} not found.`);
        }
        whereConditions.destination_airport = await getTopAirportsByContinent(continentData.continent_id);
    }

    const planesWithSeats = await getPlanesWithSeats(whereConditions, offset, limitNumber, departureSort, arrivalSort, durationSort);

    if (priceSort === 'Cheapest') {
        sortByCheapestPrice(planesWithSeats);
    }

    if (continent) {
        sortByDestinationAirport(planesWithSeats);
    }

    return planesWithSeats;
}

async function getContinentData(continent) {
    try {
        return await prisma.Continent.findFirst({
            where: { name: continent },
            select: { continent_id: true }
        });
    } catch (error) {
        console.error('Error fetching continent data:', error);
        throw new Error('Failed to fetch continent data');
    }
}

async function getTopAirportsByContinent(continentId) {
    try {
        const topAirports = await prisma.Airport.findMany({
            where: { continent_id: continentId },
            orderBy: { times_visited: 'desc' },
            select: { airport_id: true }
        });
        return { airport_id: { in: topAirports.map(airport => airport.airport_id) } };
    } catch (error) {
        console.error('Error fetching top airports by continent:', error);
        throw new Error('Failed to fetch top airports');
    }
}

async function getPlanesWithSeats(whereConditions, offset, limitNumber, departureSort, arrivalSort, durationSort) {
    try {
        let orderBy = [];
        
        if (departureSort === 'First') {
            orderBy.push({ departure_time: 'asc' });
        } else if (departureSort === 'Last') {
            orderBy.push({ departure_time: 'desc' });
        }
        
        if (arrivalSort === 'First') {
            orderBy.push({ arrival_time: 'asc' });
        } else if (arrivalSort === 'Last') {
            orderBy.push({ arrival_time: 'desc' });
        }

        if (durationSort === 'Shortest') {
            orderBy.push({ duration: 'asc' });
        } else if (durationSort === 'Longest') {
            orderBy.push({ duration: 'desc' });
        }

        return await prisma.Plane.findMany({
            where: whereConditions,
            include: {
                airline: true,
                origin_airport: { include: { continent: true } },
                destination_airport: { include: { continent: true } },
                seats: {
                    where: whereConditions.seatClass ? { class: whereConditions.seatClass } : undefined,
                    select: { class: true, price: true }
                }
            },
            skip: offset,
            take: limitNumber,
            orderBy: orderBy.length > 0 ? orderBy : undefined,
        });
    } catch (error) {
        console.error('Error fetching planes with seats:', error);
        throw new Error('Failed to fetch planes');
    }
}


function sortByCheapestPrice(planesWithSeats) {
    planesWithSeats.sort((a, b) => {
        const aPrice = Math.min(...a.seats.map(seat => seat.price));
        const bPrice = Math.min(...b.seats.map(seat => seat.price));
        return aPrice - bPrice;
    });
}

function sortByDestinationAirport(planesWithSeats) {
    planesWithSeats.sort((a, b) => {
        const aDestVisitCount = a.destination_airport.times_visited;
        const bDestVisitCount = b.destination_airport.times_visited;
        return bDestVisitCount - aDestVisitCount;
    });
}

async function countFlights({
    from,
    to,
    departureDate,
    returnDate,
    seatClass,
    continent,
    facilities,
    isReturn
}) {
    const whereConditions = buildFilterConditions({ from, to, departureDate, seatClass, continent, returnDate, facilities, isReturn });

    if (continent) {
        const continentData = await getContinentData(continent);
        if (!continentData) {
            throw new Error(`Continent ${continent} not found.`);
        }
        whereConditions.destination_airport = await getTopAirportsByContinent(continentData.continent_id);
    }

    try {
        return await prisma.Plane.count({
            where: whereConditions,
        });
    } catch (error) {
        console.error('Error counting flights:', error);
        throw new Error('Failed to count flights');
    }
}


module.exports = { fetchFlights, countFlights };