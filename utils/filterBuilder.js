function buildFilterConditions({
    from,
    to,
    departureDate,
    seatClass,
    continent,
    returnDate,
    isReturn = false,
    facilities,
    minPrice,
    maxPrice,
    departureSort,
    arrivalSort
}) {
    const parseDate = (date) => isNaN(new Date(date).getTime()) ? undefined : new Date(date + 'T00:00:00.000Z');
    const endOfDay = (date) => date ? new Date(new Date(date).setDate(new Date(date).getDate() + 1)) : undefined;

    const facilitiesMapping = {
        powerOutlets: { power_outlets: true },
        wifiAvailable: { wifi_available: true },
        mealAvailable: { meal_available: true }
    };

    const facilitiesFilters = facilities ? facilities.split(',').reduce((acc, facility) => facilitiesMapping[facility] ? { ...acc, ...facilitiesMapping[facility] } : acc, {}) : {};

    const departureDateParsed = parseDate(departureDate);
    const returnDateParsed = parseDate(returnDate);

    const conditions = {
        ...(from && { origin_airport: { airport_code: from } }),
        ...(to && { destination_airport: { airport_code: to } }),
        ...(departureDate && !isReturn && { departure_time: { gte: departureDateParsed, lt: endOfDay(departureDate) } }),
        ...(returnDate && isReturn && { departure_time: { gte: returnDateParsed, lt: endOfDay(returnDateParsed) } }),
        ...(seatClass && { seats: { some: { class: seatClass } } }),
        ...(continent && { destination_airport: { continent: { name: continent } } }),
        ...facilitiesFilters
    };

    if (minPrice || maxPrice) {
        conditions.seats = conditions.seats || {};
        conditions.seats.some = conditions.seats.some || {};
        if (minPrice) {
            conditions.seats.some.price = { gte: parseFloat(minPrice) };
        }
        if (maxPrice) {
            conditions.seats.some.price = conditions.seats.some.price || {};
            conditions.seats.some.price.lte = parseFloat(maxPrice);
        }
    }

    return conditions;
}

module.exports = { buildFilterConditions };
