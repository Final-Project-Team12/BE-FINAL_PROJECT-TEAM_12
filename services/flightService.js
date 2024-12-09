const { PrismaClient } = require("@prisma/client");
const { buildSearchConditions } = require("../utils/searchBuilder");
const { buildFilterConditions } = require("../utils/filterBuilder");
const { buildSortingConditions, sortPlanesByPrice } = require("../utils/sortingBuilder");

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
    maxPrice,
}) {
    const searchConditions = buildSearchConditions({ from, to, departureDate, seatClass, returnDate, isReturn });
    const filterConditions = buildFilterConditions({ continent, facilities, minPrice, maxPrice });
    const whereConditions = { ...searchConditions, ...filterConditions };

    const orderBy = buildSortingConditions(departureSort, arrivalSort, durationSort);

    let planesWithSeats = await getPlanesWithSeats(whereConditions, offset, limitNumber, orderBy);

    planesWithSeats.forEach(plane => {
        if (plane.seats) {
            if (seatClass) {
                plane.seats = plane.seats.filter(seat => seat.class === seatClass);
            }
        }
    });

    planesWithSeats = (minPrice || maxPrice)
    ? planesWithSeats
        .map(plane => ({
            ...plane,
            seats: plane.seats?.filter(seat =>
                (minPrice ? seat.price >= parseFloat(minPrice) : true) &&
                (maxPrice ? seat.price <= parseFloat(maxPrice) : true)
            ) || []
        }))
        .filter(plane => plane.seats.length > 0)
    : planesWithSeats;


    if (priceSort === "Cheapest" || priceSort === "Expensive") {
        sortPlanesByPrice(planesWithSeats, priceSort);
    }

    return planesWithSeats;
}

async function countFlights({
    from,
    to,
    departureDate,
    returnDate,
    seatClass,
    continent,
    facilities,
    isReturn,
    minPrice,
    maxPrice,
}) {
    const searchConditions = buildSearchConditions({ from, to, departureDate, seatClass, returnDate, isReturn });
    const filterConditions = buildFilterConditions({ continent, facilities });
    const whereConditions = { ...searchConditions, ...filterConditions };

    if (continent) {
        const continentData = await getContinentData(continent);
        if (!continentData) {
            throw new Error(`Continent ${continent} not found.`);
        }
        whereConditions.destination_airport = await getTopAirportsByContinent(continentData.continent_id);
    }

    if (minPrice || maxPrice) {
        whereConditions.seats = {
            some: {
                price: {
                    ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
                    ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
                },
            },
        };
    }

    try {
        const totalFlights = await prisma.Plane.count({
            where: whereConditions,
        });

        return totalFlights;
    } catch (error) {
        console.error("Error counting flights:", error);
        throw new Error("Failed to count flights");
    }
}

async function getPlanesWithSeats(whereConditions, offset, limitNumber, orderBy) {
    try {
        const seatConditions = whereConditions.seats ? { some: { class: whereConditions.seats.class } } : undefined;

        return await prisma.Plane.findMany({
            where: {
                ...whereConditions,
                seats: seatConditions,
            },
            include: {
                airline: true,
                origin_airport: { include: { continent: true } },
                destination_airport: { include: { continent: true } },
                seats: {
                    select: { class: true, price: true },
                },
            },
            skip: offset,
            take: limitNumber,
            orderBy: orderBy.length > 0 ? orderBy : undefined,
        });
    } catch (error) {
        console.error("Error fetching planes with seats:", error);
        throw new Error("Failed to fetch planes");
    }
}

async function getContinentData(continent) {
    try {
        return await prisma.Continent.findFirst({
            where: { name: continent },
            select: { continent_id: true },
        });
    } catch (error) {
        console.error("Error fetching continent data:", error);
        throw new Error("Failed to fetch continent data");
    }
}

async function getTopAirportsByContinent(continentId) {
    try {
        const topAirports = await prisma.Airport.findMany({
            where: { continent_id: continentId },
            orderBy: { times_visited: "desc" },
            select: { airport_id: true },
        });
        return { airport_id: { in: topAirports.map((airport) => airport.airport_id) } };
    } catch (error) {
        console.error("Error fetching top airports by continent:", error);
        throw new Error("Failed to fetch top airports");
    }
}

module.exports = { fetchFlights, countFlights };
