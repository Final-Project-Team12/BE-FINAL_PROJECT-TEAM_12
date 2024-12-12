require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const HASH = process.env.HASH;

async function main() {
  // Airport images array
  const airportImages = [
    "https://ik.imagekit.io/72mu50jam/Dubai-United-Arab-Emirates-Burj-Khalifa-top.jpg?updatedAt=1733324845922",
    "https://ik.imagekit.io/72mu50jam/1474116741_destination_for_malaysian_24343.jpg?updatedAt=1733919246551",
    "https://ik.imagekit.io/72mu50jam/71BBFEDE-473D-4F4E-82522A2197279310.jpeg?updatedAt=1733919247478",
    "https://ik.imagekit.io/72mu50jam/RA_Pianemoisland_indtravel.jpg-2-1024x683%20(1).jpg?updatedAt=1733919247935",
  ];

  // Airlines with their specific images
  const airlines = [
    {
      name: "Garuda Indonesia",
      image:
        "https://ik.imagekit.io/72mu50jam/garuda-indonesia-logo-8A90F09D68-seeklogo.com.png?updatedAt=1733325174717",
    },
    {
      name: "Nvidia",
      image:
        "https://ik.imagekit.io/72mu50jam/Nvidia_logo.svg.png?updatedAt=1733919579693",
    },
    {
      name: "Air Asia",
      image:
        "https://ik.imagekit.io/72mu50jam/AirAsia_New_Logo.svg.png?updatedAt=1733919715163",
    },
    {
      name: "Asus",
      image:
        "https://ik.imagekit.io/72mu50jam/asus.png?updatedAt=1733919659827",
    },
    {
      name: "Lion Air",
      image:
        "https://ik.imagekit.io/72mu50jam/Lion_Air-Logo.wine.svg?updatedAt=1733919579303",
    },
  ];

  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Australia",
    "Antarctica",
  ];

  // Create continents
  const continentIds = [];
  for (let i = 0; i < continents.length; i++) {
    const continent = await prisma.continent.create({
      data: { name: continents[i] },
    });
    continentIds.push(continent.continent_id);
  }

  // Create users
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

  // Create airlines
  const airlineIds = [];
  for (let i = 0; i < airlines.length; i++) {
    const airline = await prisma.airline.create({
      data: {
        airline_name: airlines[i].name,
        image_url: airlines[i].image,
        times_used: (i + 1) * 10,
        file_id: `file-id-${i + 1}`,
      },
    });
    airlineIds.push(airline.airline_id);
  }

  // Define countries and their continents
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

  // Create airports
  const airportIds = [];
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const airport = await prisma.airport.create({
      data: {
        name: country.name,
        address: `${country.name} International Airport`,
        airport_code: `${country.name.slice(0, 3)}${i + 1}`,
        image_url: airportImages[i % airportImages.length],
        file_id: `airport-${country.name}`,
        continent_id: continentIds[continents.indexOf(country.continent)],
      },
    });
    airportIds.push(airport.airport_id);
  }

  // Create planes with round-trip routes
  const planeIds = [];
  for (let i = 0; i < airportIds.length - 1; i++) {
    for (let j = 0; j < 3; j++) {
      // Create 3 flights per route
      const originIndex = i;
      const destinationIndex = (i + 1) % airportIds.length;

      // Outbound flights (Dec 8, 9, 10)
      const outboundPlane = await prisma.plane.create({
        data: {
          airline_id: airlineIds[i % airlineIds.length],
          airport_id_origin: airportIds[originIndex],
          airport_id_destination: airportIds[destinationIndex],
          departure_time: new Date(2024, 11, 8 + j, 8 + (i % 12)), // Spread throughout Dec 8-10
          arrival_time: new Date(2024, 11, 8 + j, 16 + (i % 8)),
          departure_terminal: `Terminal ${i + 1}`,
          baggage_capacity: 200 + i * 10,
          plane_code: `PLANE-${i + 1}-${j + 1}`,
          cabin_baggage_capacity: 10 + i,
          meal_available: (i + j) % 2 === 0,
          wifi_available: (i + j) % 2 !== 0,
          in_flight_entertainment: (i + j) % 2 === 0,
          power_outlets: (i + j) % 2 !== 0,
          offers: `${(i + j + 1) * 5}% OFF`,
          duration: 480,
        },
      });
      planeIds.push(outboundPlane.plane_id);

      // Return flights (Dec 12, 13, 14)
      const returnPlane = await prisma.plane.create({
        data: {
          airline_id: airlineIds[i % airlineIds.length],
          airport_id_origin: airportIds[destinationIndex],
          airport_id_destination: airportIds[originIndex],
          departure_time: new Date(2024, 11, 12 + j, 8 + (i % 12)), // Spread throughout Dec 12-14
          arrival_time: new Date(2024, 11, 12 + j, 16 + (i % 8)),
          departure_terminal: `Terminal ${i + 1}`,
          baggage_capacity: 200 + i * 10,
          plane_code: `PLANE-${i + 1}-${j + 1}-RETURN`,
          cabin_baggage_capacity: 10 + i,
          meal_available: (i + j) % 2 === 0,
          wifi_available: (i + j) % 2 !== 0,
          in_flight_entertainment: (i + j) % 2 === 0,
          power_outlets: (i + j) % 2 !== 0,
          offers: `${(i + j + 1) * 5}% OFF`,
          duration: 480,
        },
      });
      planeIds.push(returnPlane.plane_id);
    }
  }

  // Create seats for each plane
  for (let planeIndex = 0; planeIndex < planeIds.length; planeIndex++) {
    const baseIncrease = planeIndex * 50000; // Progressive pricing

    const seatClasses = [
      { name: "Economy", price: 7000000 + baseIncrease, seats: 30 },
      { name: "Premium Economy", price: 9000000 + baseIncrease, seats: 20 },
      { name: "Business", price: 11000000 + baseIncrease, seats: 10 },
      { name: "First Class", price: 20000000 + baseIncrease, seats: 5 },
    ];

    for (const classData of seatClasses) {
      for (let seatNumber = 1; seatNumber <= classData.seats; seatNumber++) {
        await prisma.seat.create({
          data: {
            class: classData.name,
            seat_number: `${classData.name.slice(0, 1)}${seatNumber}`,
            price: classData.price,
            plane_id: planeIds[planeIndex],
          },
        });
      }
    }
  }

  // Create passengers
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

  // Create transactions
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

  // Create tickets
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

  // Create notifications
  for (let i = 1; i <= 10; i++) {
    await prisma.notification.create({
      data: {
        title: `Notification ${i}`,
        description: `Description for notification ${i}`,
        user_id: userIds[i % userIds.length],
      },
    });
  }

  // Create payments
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
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
