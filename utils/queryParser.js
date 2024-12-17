function parseQueryParams(query) {
    const { from, to, departureDate, returnDate, seatClass, continent, facilities, isReturn, 
            passengerAdult = 0, passengerChild = 0, passengerInfant = 0, 
            page = 1, limit = 10, priceSort, departureSort, arrivalSort, durationSort, 
            minPrice, maxPrice } = query;

    if (minPrice && isNaN(Number(minPrice))) {
        return {
            status: 400,
            message: "The parameter minPrice must be a number."
        };
    }
    if (maxPrice && isNaN(Number(maxPrice))) {
        return {
            status: 400,
            message: "The parameter maxPrice must be a number."
        };
    }
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return {
            status: 400,
            message: "The parameter minPrice cannot be greater than maxPrice."
        };
    }

    if (parseInt(passengerInfant) > parseInt(passengerAdult)) {
        return {
            status: 400,
            message: "Each infant must be accompanied by at least one adult."
        };
    }

    if (returnDate && new Date(returnDate) < new Date(departureDate)) {
        return {
            status: 400,
            message: "The return date must be greater than departure date."
        };
    }
    

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const totalPassengers = parseInt(passengerAdult, 10) + parseInt(passengerChild, 10);

    return {
        from,
        to,
        departureDate,
        returnDate,
        seatClass,
        continent,
        facilities,
        totalPassengers,
        passengerAdult,
        passengerChild,
        passengerInfant,
        pageNumber,
        limitNumber,
        offset,
        priceSort,
        departureSort,
        arrivalSort,
        durationSort,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
    };
}

module.exports = { parseQueryParams };
