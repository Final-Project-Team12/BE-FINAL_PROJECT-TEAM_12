const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 10; i++) {
    await prisma.users.create({
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
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.airline.create({
      data: {
        airline_name: `Airline ${i}`,
        image_url: `https://example.com/airline-${i}.jpg`,
        times_used: i * 10,
        file_id: `file-id-${i}`,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.airport.create({
      data: {
        name: `Airport ${i}`,
        address: `Alamat Airport ${i}`,
        airport_code: `AA${i}`,
        image_url: `https://example.com/airport-${i}.jpg`,
        file_id: `airport-file-id-${i}`,
        continent_id: i,
      },
    });
  }

  const continents = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 
    'Australia', 'Antarctica'
  ];
  
  for (let i = 0; i < continents.length; i++) {
    await prisma.continent.create({
      data: {
        name: continents[i],
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.seat.create({
      data: {
        class: i % 2 === 0 ? 'Economy' : 'Business',
        seat_number: `S${i}`,
        price: 100 + i * 10,
        plane_id: i,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.plane.create({
      data: {
        airline_id: i,
        airport_id_origin: i,
        airport_id_destination: i + 1,
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
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.ticket.create({
      data: {
        transaction_id: i,
        plane_id: i,
        passenger_id: i,
        seat_id: i,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.transaction.create({
      data: {
        status: i % 2 === 0 ? 'Completed' : 'Pending',
        redirect_url: `https://example.com/transaction/${i}`,
        transaction_date: new Date(),
        token: `token-${i}`,
        message: `Transaction ${i}`,
        total_payment: 500 + i * 10,
        user_id: i,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.notification.create({
      data: {
        title: `Notification ${i}`,
        description: `Description for notification ${i}`,
        user_id: i,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.passenger.create({
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
