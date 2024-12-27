const { calculateAvailableSeats } = require("./seatCalculator");

async function formatFlights(flights, seatClass, totalPassengers) {
    return Promise.all(flights.map(async (flight) => {
        const seatDetails = await Promise.all(
            [...new Map(flight.seats?.map(seat => [seat.class, seat])).values()].map(async (seat) => {
                const availableSeats = await calculateAvailableSeats(flight.plane_id, seat.class);
                return { class: seat.class, price: Math.min(...flight.seats.filter(s => s.class === seat.class).map(s => s.price)), available_seats: availableSeats };
            })
        );

        const availableSeatsForClass = seatDetails.find(seat => seat.class === seatClass)?.available_seats || 0;
        /* istanbul ignore next */
        if (availableSeatsForClass >= totalPassengers) {
            const { seats, ...rest } = flight;
            return { ...rest, seats_detail: seatDetails };
        }
        /* istanbul ignore next */
        return null;
    })).then(formattedFlights => {
        return formattedFlights.filter(flight => flight !== null);
    });
}

module.exports = { formatFlights };
