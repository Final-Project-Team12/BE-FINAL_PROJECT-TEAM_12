

function parseQueryParams(query) {
    const { from, to, departureDate, returnDate, seatClass, continent, facilities, isReturn, passengerAdult = 0, passengerChild = 0, passengerInfant = 0, page = 1, limit = 10, priceSort, departureSort, arrivalSort, durationSort } = query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    return { from, to, departureDate, returnDate, seatClass, continent, facilities, totalPassengers: parseInt(passengerAdult, 10) + parseInt(passengerChild, 10), pageNumber, limitNumber, offset, priceSort, departureSort, arrivalSort, durationSort };
}


module.exports = { parseQueryParams };