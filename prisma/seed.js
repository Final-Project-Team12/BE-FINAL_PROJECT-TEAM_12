const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const continents = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 
    'Australia', 'Antarctica'
  ];

  const continentIds = [];
  for (let i = 0; i < continents.length; i++) {
    const continent = await prisma.continent.create({
      data: {
        name: continents[i],
      },
    });
    continentIds.push(continent.continent_id);
  }

  const userIds = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.users.create({
      data: {
        name: `User ${i}`,
        telephone_number: `0812345678${i}`,
        email: `user${i}@example.com`,
        password: `password${i}`,
        address: `Alamat ${i}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        identity_number: `1234567890${i}`,
        age: 20 + i,
        role: i % 2 === 0 ? 'Admin' : 'User',
      },
    });
    userIds.push(user.user_id);
  }

  const airlineIds = [];
  for (let i = 1; i <= 10; i++) {
    const airline = await prisma.airline.create({
      data: {
        airline_name: `Airline ${i}`,
        image_url: `https://example.com/airline-${i}.jpg`,
        times_used: i * 10,
        file_id: `file-id-${i}`,
      },
    });
    airlineIds.push(airline.airline_id);
  }

  const airportIds = [];
  for (let i = 1; i <= 10; i++) {
    const airport = await prisma.airport.create({
      data: {
        name: `Airport ${i}`,
        address: `Alamat Airport ${i}`,
        airport_code: `AA${i}`,
        image_url: `https://example.com/airport-${i}.jpg`,
        file_id: `airport-file-id-${i}`,
        continent_id: continentIds[i % continentIds.length], 
      },
    });
    airportIds.push(airport.airport_id);
  }

  const planeIds = [];
  for (let i = 1; i <= 10; i++) {
    const plane = await prisma.plane.create({
      data: {
        airline_id: airlineIds[i % airlineIds.length], 
        airport_id_origin: airportIds[i % airportIds.length], 
        airport_id_destination: airportIds[(i + 1) % airportIds.length], 
        departure_time: new Date(),
        arrival_time: new Date(),
        departure_terminal: `Terminal ${i}`,
        baggage_capacity: 200 + i * 10,
        plane_code: `PLANE-${i}`,
        cabin_baggage_capacity: 10 + i,
        meal_available: i % 2 === 0,
        wifi_available: i % 2 !== 0,
        in_flight_entertainment: i % 2 === 0,
        power_outlets: i % 2 !== 0,
        offers: `Offer ${i}`,
        duration: 120 + i * 5,
      },
    });
    planeIds.push(plane.plane_id);
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.seat.create({
      data: {
        class: i % 2 === 0 ? 'Economy' : 'Business',
        seat_number: `S${i}`,
        price: 100 + i * 10,
        plane_id: planeIds[i % planeIds.length], 
      },
    });
  }

  const passengerIds = [];
  for (let i = 1; i <= 10; i++) {
    const passenger = await prisma.passenger.create({
      data: {
        title: i % 2 === 0 ? 'Mr.' : 'Ms.',
        name: `Passenger ${i}`,
        last_name: `LastName ${i}`,
        nationality: 'Indonesian',
        identity_number: `123456789012345${i}`,
        issuing_country: 'Indonesia',
        valid_until: new Date(),
      },
    });
    passengerIds.push(passenger.passenger_id);
  }

  const transactionIds = [];
  for (let i = 1; i <= 10; i++) {
    const transaction = await prisma.transaction.create({
      data: {
        status: i % 2 === 0 ? 'Completed' : 'Pending',
        redirect_url: `https://example.com/transaction/${i}`,
        transaction_date: new Date(),
        token: `token-${i}`,
        message: `Transaction ${i}`,
        total_payment: 500 + i * 10,
        user_id: userIds[i % userIds.length], 
      },
    });
    transactionIds.push(transaction.transaction_id);
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.ticket.create({
      data: {
        transaction_id: transactionIds[i % transactionIds.length], 
        plane_id: planeIds[i % planeIds.length], 
        passenger_id: passengerIds[i % passengerIds.length], 
        seat_id: i, 
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.notification.create({
      data: {
        title: `Notification ${i}`,
        description: `Description for notification ${i}`,
        user_id: userIds[i % userIds.length], 
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.payment.create({
      data: {
        orderId: `order-${i}`,
        status: i % 2 === 0 ? 'Completed' : 'Pending',
        transactionId: `transaction-${i}`,
        amount: 1000 + i * 50,
        snapToken: `snap-token-${i}`,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
        customerPhone: `0812345678${i}`,
        customerAddress: `Alamat Customer ${i}`,
      },
    });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
