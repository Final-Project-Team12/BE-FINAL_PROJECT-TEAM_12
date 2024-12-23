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

  const airportIds = [];
  const airports = [
    {
      name: "Soekarno-Hatta International Airport",
      code: "CGK",
      country: "Indonesia",
      continent: "Asia",
    },
    {
      name: "Ngurah Rai International Airport",
      code: "DPS",
      country: "Indonesia",
      continent: "Asia",
    },
    {
      name: "Kuala Lumpur International Airport",
      code: "KUL",
      country: "Malaysia",
      continent: "Asia",
    },
    {
      name: "John F. Kennedy International Airport",
      code: "JFK",
      country: "United States",
      continent: "North America",
    },
    {
      name: "Frankfurt Airport",
      code: "FRA",
      country: "Germany",
      continent: "Europe",
    },
    {
      name: "São Paulo/Guarulhos International Airport",
      code: "GRU",
      country: "Brazil",
      continent: "South America",
    },
    {
      name: "Sydney Airport",
      code: "SYD",
      country: "Australia",
      continent: "Australia",
    },
    {
      name: "O.R. Tambo International Airport",
      code: "JNB",
      country: "South Africa",
      continent: "Africa",
    },
    {
      name: "Toronto Pearson International Airport",
      code: "YYZ",
      country: "Canada",
      continent: "North America",
    },
    {
      name: "Heathrow Airport",
      code: "LHR",
      country: "United Kingdom",
      continent: "Europe",
    },
    {
      name: "Charles de Gaulle Airport",
      code: "CDG",
      country: "France",
      continent: "Europe",
    },
    {
      name: "Dubai International Airport",
      code: "DXB",
      country: "UAE",
      continent: "Asia",
    },
    {
      name: "Singapore Changi Airport",
      code: "SIN",
      country: "Singapore",
      continent: "Asia",
    },
    {
      name: "Hong Kong International Airport",
      code: "HKG",
      country: "Hong Kong",
      continent: "Asia",
    },
    {
      name: "Tokyo Narita International Airport",
      code: "NRT",
      country: "Japan",
      continent: "Asia",
    },
    {
      name: "Incheon International Airport",
      code: "ICN",
      country: "South Korea",
      continent: "Asia",
    },
    {
      name: "Amsterdam Airport Schiphol",
      code: "AMS",
      country: "Netherlands",
      continent: "Europe",
    },
    {
      name: "Munich Airport",
      code: "MUC",
      country: "Germany",
      continent: "Europe",
    },
    {
      name: "Barcelona–El Prat Airport",
      code: "BCN",
      country: "Spain",
      continent: "Europe",
    },
    {
      name: "Rome Fiumicino Airport",
      code: "FCO",
      country: "Italy",
      continent: "Europe",
    },
    {
      name: "Istanbul Airport",
      code: "IST",
      country: "Turkey",
      continent: "Europe",
    },
    {
      name: "Zurich Airport",
      code: "ZRH",
      country: "Switzerland",
      continent: "Europe",
    },
  ];

  for (let i = 0; i < airports.length; i++) {
    const airport = await prisma.airport.create({
      data: {
        name: airports[i].name,
        address: `${airports[i].name}, ${airports[i].country}`,
        airport_code: airports[i].code,
        image_url: airportImages[i % airportImages.length],
        file_id: `airport-file-id-${i + 1}`,
        continent_id: continentIds[continents.indexOf(airports[i].continent)],
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
        departure_time: new Date(2024, 11, 8),
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

    // Create 72 seats per plane with specific class distributions
    for (let seatId = 1; seatId <= 72; seatId++) {
      let seatClass;
      let price;

      if (seatId <= 18) {
        seatClass = "First Class";
        price = 18000000;
      } else if (seatId <= 36) {
        seatClass = "Business";
        price = 12000000;
      } else if (seatId <= 54) {
        seatClass = "Premium Economy";
        price = 6000000;
      } else {
        seatClass = "Economy";
        price = 3000000;
      }

      const row = Math.ceil(seatId / 6);
      const colIndex = (seatId - 1) % 6;
      const columns = ["A", "B", "C", "D", "E", "F"];
      const seatNumber = `${columns[colIndex]}${row}`;

      await prisma.seat.create({
        data: {
          seat_number: seatNumber,
          class: seatClass,
          price: price,
          plane_id: plane.plane_id,
          is_available: true,
          version: 0,
        },
      });
    }

    // Create reverse flight
    const reversePlane = await prisma.plane.create({
      data: {
        airline_id: airlineIds[i % airlineIds.length],
        airport_id_origin: airportIds[destinationIndex],
        airport_id_destination: airportIds[originIndex],
        departure_time: new Date(2024, 11, 12),
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

    // Create seats for reverse plane
    for (let seatId = 1; seatId <= 72; seatId++) {
      let seatClass;
      let price;

      if (seatId <= 18) {
        seatClass = "First Class";
        price = 18000000;
      } else if (seatId <= 36) {
        seatClass = "Business";
        price = 12000000;
      } else if (seatId <= 54) {
        seatClass = "Premium Economy";
        price = 6000000;
      } else {
        seatClass = "Economy";
        price = 3000000;
      }

      const row = Math.ceil(seatId / 6);
      const colIndex = (seatId - 1) % 6;
      const columns = ["A", "B", "C", "D", "E", "F"];
      const seatNumber = `${columns[colIndex]}${row}`;

      await prisma.seat.create({
        data: {
          seat_number: seatNumber,
          class: seatClass,
          price: price,
          plane_id: reversePlane.plane_id,
          is_available: true,
          version: 0,
        },
      });
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