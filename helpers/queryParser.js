function parseQueryParams(query) {
    const { from, to, departureDate, returnDate, seatClass, continent, facilities, isReturn, 
            passengerAdult = 0, passengerChild = 0, passengerInfant = 0, 
            page = 1, limit = 10, priceSort, departureSort, arrivalSort, durationSort, 
            minPrice, maxPrice } = query;

    if (minPrice && isNaN(Number(minPrice))) {
        return {
            status: "Error",
            statusCode: 400,
            message: "Parameter minPrice harus berupa angka."
        };
    }
    if (maxPrice && isNaN(Number(maxPrice))) {
        return {
            status: "Error",
            statusCode: 400,
            message: "Parameter maxPrice harus berupa angka."
        };
    }
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return {
            status: "Error",
            statusCode: 400,
            message: "Parameter minPrice tidak boleh lebih besar dari maxPrice."
        };
    }

    if (parseInt(passengerInfant) > parseInt(passengerAdult)) {
        return {
            status: "Error",
            statusCode: 400,
            message: "Setiap infant harus didampingi oleh setidaknya satu adult."
        };
    }

    if (returnDate && new Date(returnDate) < new Date(departureDate)) {
        return {
            status: "Error",
            statusCode: 400,
            message: "Tanggal return harus lebih besar atau sama dengan tanggal keberangkatan."
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
