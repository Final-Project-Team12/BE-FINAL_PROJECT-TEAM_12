function buildSearchConditions({ 
    from, 
    to, 
    departureDate, 
    seatClass, 
    returnDate, 
    isReturn = false 
}) {
    const parseDate = (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return undefined;
        }
        // Hanya ambil bagian tanggal, abaikan waktu
        return new Date(parsedDate.setHours(0, 0, 0, 0)); // Set waktu ke 00:00:00
    };

    const departureDateParsed = parseDate(departureDate);
    const returnDateParsed = parseDate(returnDate);

    const { origin, destination, departureTime } = isReturn ? 
        { origin: to, destination: from, departureTime: returnDateParsed } : 
        { origin: from, destination: to, departureTime: departureDateParsed };

    const conditions = {
        ...(origin && destination && {
            origin_airport: { airport_code: origin },
            destination_airport: { airport_code: destination },
            departure_time: departureTime ? {
                gte: departureTime, // Ambil semua penerbangan setelah atau pada 00:00:00
                lt: new Date(departureTime.getTime() + 24 * 60 * 60 * 1000) // Ambil sampai sebelum 23:59:59
            } : undefined,
        }),

        ...(seatClass && { seats: { some: { class: seatClass } } }),
    };

    console.log("Generated Search Conditions:", JSON.stringify(conditions, null, 2));
    
    return conditions;
}

module.exports = { buildSearchConditions };
