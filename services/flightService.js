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

    const planesWithSeats = await getPlanesWithSeats(whereConditions, offset, limitNumber, orderBy);

    if (priceSort === "Cheapest" || priceSort === "Expensive") {
        sortPlanesByPrice(planesWithSeats, priceSort);
    }

    planesWithSeats.forEach(plane => {
        if (plane.seats) {
            // Filter seats berdasarkan seatClass jika ada
            if (seatClass) {
                // Memfilter kursi berdasarkan seatClass
                plane.seats = plane.seats.filter(seat => seat.class === seatClass);
            }
            // Jika tidak ada seatClass, maka kita biarkan 'seats' seperti semula
        }
    });
    

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

    try {
        return await prisma.Plane.count({
            where: whereConditions,
        });
    } catch (error) {
        console.error("Error counting flights:", error);
        throw new Error("Failed to count flights");
    }
}

async function getPlanesWithSeats(whereConditions, offset, limitNumber, orderBy) {
    try {
        // Pastikan kita hanya menyertakan filter untuk seats jika diperlukan
        const seatConditions = whereConditions.seats ? { some: { class: whereConditions.seats.class } } : undefined;

        return await prisma.Plane.findMany({
            where: {
                ...whereConditions,
                seats: seatConditions, // Hanya menambahkan filter untuk seats jika ada
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
