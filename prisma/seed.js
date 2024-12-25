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
      data: { name: continents[i] },
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
        role: i % 2 === 0 ? "admin" : "user",
      },
    });
    userIds.push(user.user_id);
  }

  const airlines = [
    {
      name: "Lion Air",
      image:
        "https://ik.imagekit.io/72mu50jam/Lion_Air-Logo.wine.svg?updatedAt=1733919579303",
    },
    {
      name: "Air Asia",
      image:
        "https://ik.imagekit.io/72mu50jam/AirAsia_New_Logo.svg.png?updatedAt=1733919715163",
    },
    {
      name: "Garuda Indonesia",
      image:
        "https://ik.imagekit.io/72mu50jam/garuda-indonesia-logo-8A90F09D68-seeklogo.com.png?updatedAt=1733325174717",
    },
    {
      name: "Etihad Airways",
      image:
        "https://ik.imagekit.io/72mu50jam/etihad.png?updatedAt=1734886002218",
    },
    {
      name: "Oman Air",
      image:
        "https://ik.imagekit.io/72mu50jam/oman-air-logo-4FCF52F691-seeklogo.com.png?updatedAt=1734887459453",
    },
    {
      name: "Qatar Airways",
      image:
        "https://ik.imagekit.io/72mu50jam/800px-Qatar_Airways_Logo.png?updatedAt=1734886002596",
    },
    {
      name: "Citilink",
      image:
        "https://ik.imagekit.io/72mu50jam/citi-logo.png?updatedAt=1734886002915",
    },
    {
      name: "Fly Emirates",
      image:
        "https://ik.imagekit.io/72mu50jam/373-3737047_request-a-demo-fly-emirates-logo-png.png?updatedAt=1734886003276",
    },
    {
      name: "Batik Air",
      image:
        "https://ik.imagekit.io/72mu50jam/Logo%20Batik%20Air%20(Cover).png?updatedAt=1734886003832",
    },
  ];

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

  const airportImages = [
    "https://ik.imagekit.io/72mu50jam/RA_Pianemoisland_indtravel.jpg-2-1024x683%20(1).jpg?updatedAt=1733919247935",
    "https://ik.imagekit.io/72mu50jam/71BBFEDE-473D-4F4E-82522A2197279310.jpeg?updatedAt=1733919247478",
    "https://ik.imagekit.io/72mu50jam/1474116741_destination_for_malaysian_24343.jpg?updatedAt=1733919246551",
    "https://ik.imagekit.io/72mu50jam/Dubai-United-Arab-Emirates-Burj-Khalifa-top.jpg?updatedAt=1733324845922",
    "https://ik.imagekit.io/72mu50jam/Russia.jpg?updatedAt=1734886402647",
    "https://ik.imagekit.io/72mu50jam/amsterdam.jpg?updatedAt=1734886403708",
    "https://ik.imagekit.io/72mu50jam/new%20zealand.jpg?updatedAt=1734886403861",
    "https://ik.imagekit.io/72mu50jam/swiss.jpg?updatedAt=1734886404090",
    "https://ik.imagekit.io/72mu50jam/japan.jpg?updatedAt=1734886405616",
  ];

  const airports = [
    {
      name: "John F. Kennedy International Airport",
      code: "JFK",
      country: "United States",
      continent: "North America",
      image: airportImages[3],
    },
    {
      name: "Frankfurt Airport",
      code: "FRA",
      country: "Germany",
      continent: "Europe",
      image: airportImages[5],
    },
    {
      name: "Tokyo Narita International Airport",
      code: "NRT",
      country: "Japan",
      continent: "Asia",
      image: airportImages[8],
    },
    {
      name: "Dubai International Airport",
      code: "DXB",
      country: "United Arab Emirates",
      continent: "Asia",
      image: airportImages[3],
    },
    {
      name: "London Heathrow Airport",
      code: "LHR",
      country: "United Kingdom",
      continent: "Europe",
      image: airportImages[1],
    },
    {
      name: "Singapore Changi Airport",
      code: "SIN",
      country: "Singapore",
      continent: "Asia",
      image: airportImages[2],
    },
    {
      name: "Sydney Airport",
      code: "SYD",
      country: "Australia",
      continent: "Australia",
      image: airportImages[6],
    },
    {
      name: "Zurich Airport",
      code: "ZRH",
      country: "Switzerland",
      continent: "Europe",
      image: airportImages[7],
    },
    {
      name: "Moscow Sheremetyevo Airport",
      code: "SVO",
      country: "Russia",
      continent: "Europe",
      image: airportImages[4],
    },
  ];

  const airportIds = [];
  for (const airport of airports) {
    const newAirport = await prisma.airport.create({
      data: {
        name: airport.name,
        address: `${airport.name}, ${airport.country}`,
        airport_code: airport.code,
        image_url: airport.image,
        file_id: `airport-file-id-${airport.code}`,
        continent_id: continentIds[continents.indexOf(airport.continent)],
      },
    });
    airportIds.push(newAirport.airport_id);
  }

  function createDateTime(year, month, day, hours, minutes) {
    return new Date(year, month - 1, day, hours, minutes);
  }

  function getSeatClassAndPrice(seatId) {
    if (seatId <= 18) {
      return { seatClass: "First Class", price: 18000000 };
    } else if (seatId <= 36) {
      return { seatClass: "Business", price: 12000000 };
    } else if (seatId <= 54) {
      return { seatClass: "Premium Economy", price: 6000000 };
    } else {
      return { seatClass: "Economy", price: 3000000 };
    }
  }

  function generateSeatNumber(seatId) {
    const columns = ["A", "B", "C", "D", "E", "F"];
    const row = Math.ceil(seatId / 6);
    const colIndex = (seatId - 1) % 6;
    return `${columns[colIndex]}${row}`;
  }

  function generateFlightDates(numberOfDays = 30) {
    const dates = [];
    const startDate = new Date();

    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      dates.push({
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });
    }

    return dates;
  }

  function generateRandomDiscount() {
    const discounts = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    return discounts[Math.floor(Math.random() * discounts.length)];
  }

  function generateOffer(route, discount) {
    const offerTypes = [
      `${discount}% OFF Today!`,
      `Flash Sale ${discount}%`,
      `Limited Time Offer ${discount}%`,
      `Today's Deal: ${discount}% OFF`,
      `Special ${discount}% Discount`,
    ];
    return offerTypes[Math.floor(Math.random() * offerTypes.length)];
  }

  const planeIds = [];
  const flightSchedules = generateFlightDates(30);

  const routes = [
    { origin: "JFK", destination: "FRA" }, // US to Germany
    { origin: "JFK", destination: "NRT" }, // US to Japan
    { origin: "DXB", destination: "LHR" }, // Dubai to London
    { origin: "SIN", destination: "SYD" }, // Singapore to Sydney
    { origin: "ZRH", destination: "SVO" }, // Zurich to Moscow
    { origin: "SIN", destination: "NRT" }, // Singapore to Japan
    { origin: "DXB", destination: "SIN" }, // Dubai to Singapore
    { origin: "LHR", destination: "SYD" }, // London to Sydney
    { origin: "FRA", destination: "SVO" }, // Frankfurt to Moscow
    { origin: "NRT", destination: "SYD" }, // Tokyo to Sydney
    { origin: "LHR", destination: "DXB" }, // London to Dubai
    { origin: "SVO", destination: "NRT" }, // Moscow to Tokyo
    { origin: "FRA", destination: "SIN" }, // Frankfurt to Singapore
    { origin: "JFK", destination: "LHR" }, // New York to London
    { origin: "SYD", destination: "SIN" }, // Sydney to Singapore
  ];

  // Create flights for each schedule
  for (let i = 0; i < flightSchedules.length; i++) {
    const schedule = flightSchedules[i];

    // Create flights for each route on this date
    for (const route of routes) {
      const originAirport = airports.find((a) => a.code === route.origin);
      const destAirport = airports.find((a) => a.code === route.destination);
      const originId = airportIds[airports.indexOf(originAirport)];
      const destId = airportIds[airports.indexOf(destAirport)];

      // Morning flight (outbound)
      const discount = generateRandomDiscount();
      const morningFlight = await prisma.plane.create({
        data: {
          airline_id: airlineIds[i % airlineIds.length],
          airport_id_origin: originId,
          airport_id_destination: destId,
          departure_time: createDateTime(
            schedule.year,
            schedule.month,
            schedule.date,
            8,
            0
          ),
          arrival_time: createDateTime(
            schedule.year,
            schedule.month,
            schedule.date,
            20,
            0
          ),
          departure_terminal: `Terminal ${1 + (i % 3)}`,
          baggage_capacity: 200,
          plane_code: `${route.origin}-${route.destination}-${schedule.date}${schedule.month}-AM`,
          cabin_baggage_capacity: 10,
          meal_available: true,
          wifi_available: true,
          in_flight_entertainment: true,
          power_outlets: true,
          offers: generateOffer(route, discount),
          duration: 720,
        },
      });
      planeIds.push(morningFlight.plane_id);

      // Create seats for morning flight
      for (let seatId = 1; seatId <= 72; seatId++) {
        const { seatClass, price } = getSeatClassAndPrice(seatId);
        const seatNumber = generateSeatNumber(seatId);
        await prisma.seat.create({
          data: {
            seat_number: seatNumber,
            class: seatClass,
            price: price,
            plane_id: morningFlight.plane_id,
            is_available: true,
            version: 0,
          },
        });
      }

      // Evening flight (return)
      const eveningDiscount = generateRandomDiscount();
      const eveningFlight = await prisma.plane.create({
        data: {
          airline_id: airlineIds[i % airlineIds.length],
          airport_id_origin: destId,
          airport_id_destination: originId,
          departure_time: createDateTime(
            schedule.year,
            schedule.month,
            schedule.date,
            21,
            0
          ),
          arrival_time: createDateTime(
            schedule.year,
            schedule.month,
            schedule.date + 1,
            9,
            0
          ),
          departure_terminal: `Terminal ${1 + (i % 3)}`,
          baggage_capacity: 200,
          plane_code: `${route.destination}-${route.origin}-${schedule.date}${schedule.month}-PM`,
          cabin_baggage_capacity: 10,
          meal_available: true,
          wifi_available: true,
          in_flight_entertainment: true,
          power_outlets: true,
          offers: generateOffer(route, eveningDiscount),
          duration: 720,
        },
      });
      planeIds.push(eveningFlight.plane_id);

      // Create seats for evening flight
      for (let seatId = 1; seatId <= 72; seatId++) {
        const { seatClass, price } = getSeatClassAndPrice(seatId);
        const seatNumber = generateSeatNumber(seatId);
        await prisma.seat.create({
          data: {
            seat_number: seatNumber,
            class: seatClass,
            price: price,
            plane_id: eveningFlight.plane_id,
            is_available: true,
            version: 0,
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
        full_name: `Passenger ${i}`,
        family_name: `LastName ${i}`,
        nationality: "Indonesian",
        id_number: `123456789012345${i}`,
        id_issuer: "Indonesia",
        id_expiry: new Date(),
      },
    });
    passengerIds.push(passenger.passenger_id);
  }

  const transactionIds = [];
  for (let i = 1; i <= 10; i++) {
    const baseAmount = 1000000;
    const taxAmount = Math.round(baseAmount * 0.1);
    const totalPayment = baseAmount + taxAmount;

    const transaction = await prisma.transaction.create({
      data: {
        status: i % 2 === 0 ? "Completed" : "Pending",
        redirect_url: `https://example.com/transaction/${i}`,
        transaction_date: new Date(),
        token: `token-${i}`,
        message: `Transaction ${i}`,
        base_amount: baseAmount,
        tax_amount: taxAmount,
        total_payment: totalPayment,
        user_id: userIds[i % userIds.length],
      },
    });
    transactionIds.push(transaction.transaction_id);
  }

  // Create tickets
  for (let i = 1; i <= 10; i++) {
    const availableSeat = await prisma.seat.findFirst({
      where: {
        plane_id: planeIds[i % planeIds.length],
        is_available: true,
      },
    });

    if (availableSeat) {
      await prisma.$transaction([
        prisma.ticket.create({
          data: {
            transaction_id: transactionIds[i % transactionIds.length],
            plane_id: planeIds[i % planeIds.length],
            passenger_id: passengerIds[i % passengerIds.length],
            seat_id: availableSeat.seat_id,
          },
        }),
        prisma.seat.update({
          where: { seat_id: availableSeat.seat_id },
          data: {
            is_available: false,
            version: { increment: 1 },
          },
        }),
      ]);
    }
  }

  // Create notifications
  for (let i = 1; i <= 10; i++) {
    await prisma.notification.create({
      data: {
        title: `Notification ${i}`,
        description: `Description for notification ${i}`,
        user_id: userIds[i % userIds.length],
        notification_date: new Date("2024-12-12T00:00:00+07:00"),
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

  const seatCount = await prisma.seat.count();
  const availableSeats = await prisma.seat.count({
    where: { is_available: true },
  });

  console.log("Seeding complete");
  console.log(`Total seats created: ${seatCount}`);
  console.log(`Available seats: ${availableSeats}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });