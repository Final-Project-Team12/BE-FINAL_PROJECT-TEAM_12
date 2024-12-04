function buildFilterConditions({ from, to, departureDate, seatClass, continent, returnDate, isReturn = false, facilities }) {
    const parseDate = (date) => isNaN(new Date(date).getTime()) ? undefined : new Date(date + 'T00:00:00.000Z');
    const endOfDay = (date) => date ? new Date(new Date(date).setDate(new Date(date).getDate() + 1)) : undefined;

    const facilitiesMapping = {
        powerOutlets: { power_outlets: true },
        wifiAvailable: { wifi_available: true },
        mealAvailable: { meal_available: true }
    };

    const facilitiesFilters = facilities ? facilities.split(',').reduce((acc, facility) => facilitiesMapping[facility] ? { ...acc, ...facilitiesMapping[facility] } : acc, {}) : {};

    return {
        ...(from && { origin_airport: { airport_code: from } }),
        ...(to && { destination_airport: { airport_code: to } }),
        ...(departureDate && !isReturn && { departure_time: { gte: parseDate(departureDate), lt: endOfDay(departureDate) } }),
        ...(returnDate && isReturn && { departure_time: { gte: parseDate(returnDate), lt: endOfDay(returnDate) } }),
        ...(seatClass && { seats: { some: { class: seatClass } } }),
        ...(continent && { destination_airport: { continent: { name: continent } } }),
        ...facilitiesFilters
    };
}

module.exports = { buildFilterConditions };
