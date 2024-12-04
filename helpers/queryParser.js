const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parseQueryParams(query) {
    const { from, to, departureDate, returnDate, seatClass, continent, facilities, passengerAdult = 0, passengerChild = 0, passengerInfant = 0, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, min_price } = query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    return { from, to, departureDate, returnDate, seatClass, continent, facilities, totalPassengers: parseInt(passengerAdult, 10) + parseInt(passengerChild, 10), pageNumber, limitNumber, offset, min_price };
}

module.exports = { parseQueryParams };
