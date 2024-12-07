function buildSortingConditions(departureSort, arrivalSort, durationSort) {
    const orderBy = [];

    if (departureSort === 'First') {
        orderBy.push({ departure_time: 'asc' });
    } else if (departureSort === 'Last') {
        orderBy.push({ departure_time: 'desc' });
    }

    if (arrivalSort === 'First') {
        orderBy.push({ arrival_time: 'asc' });
    } else if (arrivalSort === 'Last') {
        orderBy.push({ arrival_time: 'desc' });
    }

    if (durationSort === 'Shortest') {
        orderBy.push({ duration: 'asc' });
    } else if (durationSort === 'Longest') {
        orderBy.push({ duration: 'desc' });
    }

    return orderBy;
}

function sortPlanesByPrice(planesWithSeats, priceSort) {
    if (priceSort === 'Cheapest') {
        planesWithSeats.sort((a, b) => {
            const aPrice = Math.min(...a.seats.map(seat => seat.price));
            const bPrice = Math.min(...b.seats.map(seat => seat.price));
            return aPrice - bPrice;
        });
    } else if (priceSort === 'Expensive') {
        planesWithSeats.sort((a, b) => {
            const aPrice = Math.max(...a.seats.map(seat => seat.price));
            const bPrice = Math.max(...b.seats.map(seat => seat.price));
            return bPrice - aPrice;
        });
    }
}

module.exports = { buildSortingConditions, sortPlanesByPrice };
