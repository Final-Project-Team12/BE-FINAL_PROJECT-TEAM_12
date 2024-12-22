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
        /* istanbul ignore next */
        ...facilitiesFilters,
        ...(continent && { 
            destination_airport: { continent: { name: continent } } 
        }),
    };
    minPrice = parseFloat(minPrice || 0);  
    maxPrice = parseFloat(maxPrice || Infinity);

    return conditions;
}

module.exports = { buildFilterConditions };
