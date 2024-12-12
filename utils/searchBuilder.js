function buildSearchConditions({ 
    from, 
    to, 
    departureDate, 
    seatClass, 
    returnDate, 
    isReturn = false
}) {
    console.log(`isReturn: ${isReturn}`);
    console.log(`departureDate: ${departureDate}`);
    console.log(`returnDate: ${returnDate}`);

    const parseDate = (date) => {
        if (!date) return null; // Jika tidak ada nilai, return null
        const parsedDate = new Date(date + 'T00:00:00.000Z'); // Pastikan menggunakan waktu UTC 00:00:00
        if (isNaN(parsedDate.getTime())) {
            return null;
        }
        return parsedDate;
    };

    // Parsing tanggal
    let departureDateParsed = parseDate(departureDate);
    let returnDateParsed = parseDate(returnDate);

    console.log(`Parsed departureDate: ${departureDateParsed ? departureDateParsed.toISOString() : "Invalid date"}`);
    console.log(`Parsed returnDate: ${returnDateParsed ? returnDateParsed.toISOString() : "null"}`);

    let departureTime;
    let origin, destination;

    if (isReturn) {
        departureTime = returnDateParsed;
        origin = to; // Penerbangan pulang (dari tujuan kembali ke asal)
        destination = from;
    } else {
        // Jika isReturn = false, gunakan departureDate sebagai departureTime
        departureTime = departureDateParsed;
        origin = from;
        destination = to;
    }

    // Menyusun kondisi pencarian berdasarkan parameter yang diterima
    const conditions = {
        ...(origin && destination && {
            origin_airport: { airport_code: origin },
            destination_airport: { airport_code: destination },
            departure_time: departureTime ? {
                gte: departureTime, // Ambil semua penerbangan setelah atau pada 00:00:00
                lt: new Date(departureTime.getTime() + 24 * 60 * 60 * 1000) // Ambil sampai sebelum 23:59:59
            } : undefined,
        }),

        ...(seatClass && { seats: { some: { class: seatClass } } } ),
    };

    // Log kondisi yang dihasilkan
    console.log("Generated Search Conditions:", JSON.stringify(conditions, null, 2));

    return conditions;
}

module.exports = { buildSearchConditions };
