function buildFilterConditions({ 
    continent, 
    facilities, 
    minPrice, 
    maxPrice 
}) {
    const facilitiesMapping = {
        powerOutlets: { power_outlets: true },
        wifiAvailable: { wifi_available: true },
        mealAvailable: { meal_available: true }
    };

    const facilitiesFilters = facilities 
        ? facilities.split(',').reduce((acc, facility) => 
            facilitiesMapping[facility] ? { ...acc, ...facilitiesMapping[facility] } : acc, 
        {}) 
        : {};

    const conditions = {
        ...facilitiesFilters,
        ...(continent && { 
            destination_airport: { continent: { name: continent } } 
        }),
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
