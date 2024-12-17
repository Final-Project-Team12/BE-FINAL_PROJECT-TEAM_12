function buildSearchConditions({ 
    from, 
    to, 
    departureDate, 
    seatClass, 
    returnDate, 
    isReturn = false
}) {
  

    const parseDate = (date) => {
        if (!date) return null; 
        const parsedDate = new Date(date + 'T00:00:00.000Z'); 
        if (isNaN(parsedDate.getTime())) {
            return null;
        }
        return parsedDate;
    };

    let departureDateParsed = parseDate(departureDate);
    let returnDateParsed = parseDate(returnDate);



    let departureTime;
    let origin, destination;

    if (isReturn) {
        departureTime = returnDateParsed;
        origin = to; 
        destination = from;
    } else {
        departureTime = departureDateParsed;
        origin = from;
        destination = to;
    }

    const conditions = {
        ...(origin && destination && {
            origin_airport: { airport_code: origin },
            destination_airport: { airport_code: destination },
            departure_time: departureTime ? {
                gte: departureTime, 
                lt: new Date(departureTime.getTime() + 24 * 60 * 60 * 1000) 
            } : undefined,
        }),

        ...(seatClass && { seats: { some: { class: seatClass } } } ),
    };


    return conditions;
}

module.exports = { buildSearchConditions };
