require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const HASH = process.env.HASH;

async function main() {
  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Australia",
    "Antarctica",
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
        password: bcrypt.hashSync(`password${i}`, parseInt(HASH)),
        address: `Alamat ${i}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        identity_number: `1234567890${i}`,
        age: 20 + i,
        role: i % 2 === 0 ? "Admin" : "User",
      },
    });
    userIds.push(user.user_id);
  }

  const airlineIds = [];
  for (let i = 1; i <= 10; i++) {
    const airline = await prisma.airline.create({
      data: {
        airline_name: "Garuda Indonesia",
        image_url:
          "https://ik.imagekit.io/72mu50jam/garuda-indonesia-logo-8A90F09D68-seeklogo.com.png?updatedAt=1733325174717",
        times_used: i * 10,
        file_id: `file-id-${i}`,
      },
    });
    airlineIds.push(airline.airline_id);
  }

  const airportIds = [];
  const countries = [
    { name: "Indonesia", continent: "Asia" },
    { name: "Malaysia", continent: "Asia" },
    { name: "United States", continent: "North America" },
    { name: "Germany", continent: "Europe" },
    { name: "Brazil", continent: "South America" },
    { name: "Australia", continent: "Australia" },
    { name: "South Africa", continent: "Africa" },
    { name: "Canada", continent: "North America" },
    { name: "United Kingdom", continent: "Europe" },
    { name: "France", continent: "Europe" },
    { name: "Argentina", continent: "South America" },
  ];

  for (let i = 1; i <= 22; i++) {
    const country = countries[i % countries.length];
    const airport = await prisma.airport.create({
      data: {
        name: `${country.name}`,
        address: `Alamat ${country.name}`,
        airport_code: `${country.name.slice(0, 3)}${i}`,
        image_url:
          "https://ik.imagekit.io/72mu50jam/Dubai-United-Arab-Emirates-Burj-Khalifa-top.jpg?updatedAt=1733324845922",
        file_id: `airport-file-id-${i}`,
        continent_id: continentIds[continents.indexOf(country.continent)],
      },
    });
    airportIds.push(airport.airport_id);
  }

  const planeIds = [];
  for (let i = 1; i <= 22; i++) {
    const originIndex = i % airportIds.length;
    const destinationIndex = (i + 1) % airportIds.length;

    const plane = await prisma.plane.create({
      data: {
        airline_id: airlineIds[i % airlineIds.length],
        airport_id_origin: airportIds[originIndex],
        airport_id_destination: airportIds[destinationIndex],
        departure_time: new Date(2024, 11, 8), // 8 Desember 2024
        arrival_time: new Date(2024, 11, 8),
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

    // Create the reverse route
    const reversePlane = await prisma.plane.create({
      data: {
        airline_id: airlineIds[i % airlineIds.length],
        airport_id_origin: airportIds[destinationIndex],
        airport_id_destination: airportIds[originIndex],
        departure_time: new Date(2024, 11, 12), // 12 Desember 2024
        arrival_time: new Date(2024, 11, 12),
        departure_terminal: `Terminal ${i}`,
        baggage_capacity: 200 + i * 10,
        plane_code: `PLANE-${i}-REVERSE`,
        cabin_baggage_capacity: 10 + i,
        meal_available: i % 2 === 0,
        wifi_available: i % 2 !== 0,
        in_flight_entertainment: i % 2 === 0,
        power_outlets: i % 2 !== 0,
        offers: `Offer ${i}`,
        duration: 120 + i * 5,
      },
    });
    planeIds.push(reversePlane.plane_id);
  }

  // Insert seats with multiple classes and seat numbers
  for (let planeIndex = 0; planeIndex < planeIds.length; planeIndex++) {
    const seatClasses = [
      "Economy",
      "Premium Economy",
      "Business",
      "First Class",
    ];
    const seatNumbersPerClass = [30, 20, 10, 5]; // Number of seats per class

    for (let classIndex = 0; classIndex < seatClasses.length; classIndex++) {
      for (
        let seatNumber = 1;
        seatNumber <= seatNumbersPerClass[classIndex];
        seatNumber++
      ) {
        await prisma.seat.create({
          data: {
            class: seatClasses[classIndex],
            seat_number: `${seatClasses[classIndex].slice(0, 1)}${seatNumber}`,
            price:
              classIndex === 0
                ? 9000000 + Math.floor(Math.random() * 2000000)
                : classIndex === 1
                ? 10500000 + Math.floor(Math.random() * 2000000)
                : classIndex === 2
                ? 12000000 + Math.floor(Math.random() * 2000000)
                : 14000000 + Math.floor(Math.random() * 2000000),
            plane_id: planeIds[planeIndex],
          },
        });
      }
    }
  }

  const passengerIds = [];
  for (let i = 1; i <= 10; i++) {
    const passenger = await prisma.passenger.create({
      data: {
        title: i % 2 === 0 ? "Mr." : "Ms.",
        name: `Passenger ${i}`,
        last_name: `LastName ${i}`,
        nationality: "Indonesian",
        identity_number: `123456789012345${i}`,
        issuing_country: "Indonesia",
        valid_until: new Date(),
      },
    });
    passengerIds.push(passenger.passenger_id);
  }

  const transactionIds = [];
  for (let i = 1; i <= 10; i++) {
    const transaction = await prisma.transaction.create({
      data: {
        status: i % 2 === 0 ? "Completed" : "Pending",
        redirect_url: `https://example.com/transaction/${i}`,
        transaction_date: new Date(),
        token: `token-${i}`,
        message: `Transaction ${i}`,
        total_payment: 5000000 + i * 100000,
        user_id: userIds[i % userIds.length],
      },
    });
    transactionIds.push(transaction.transaction_id);
  }

  for (let i = 1; i <= 20; i++) {
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
        status: i % 2 === 0 ? "Completed" : "Pending",
        transactionId: `transaction-${i}`,
        amount: 1000000 + i * 50000,
        snapToken: `snap-token-${i}`,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
        customerPhone: `0812345678${i}`,
        customerAddress: `Alamat Customer ${i}`,
      },
    });
  }

  console.log("Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
