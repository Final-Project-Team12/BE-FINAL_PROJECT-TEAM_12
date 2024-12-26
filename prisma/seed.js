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

  // Updated flight time slots with more variation
  const flightTimeSlots = [
    { 
      slot: "early_morning",
      departures: [
        { time: 5, duration: 240 },  // 5:00 AM, 4 hours
        { time: 6, duration: 300 },  // 6:00 AM, 5 hours
        { time: 7, duration: 360 }   // 7:00 AM, 6 hours
      ]
    },
    {
      slot: "morning",
      departures: [
        { time: 9, duration: 270 },   // 9:00 AM, 4.5 hours
        { time: 10, duration: 330 },  // 10:00 AM, 5.5 hours
        { time: 11, duration: 390 }   // 11:00 AM, 6.5 hours
      ]
    },
    {
      slot: "afternoon",
      departures: [
        { time: 13, duration: 280 },  // 1:00 PM, ~4.7 hours
        { time: 14, duration: 340 },  // 2:00 PM, ~5.7 hours
        { time: 15, duration: 400 }   // 3:00 PM, ~6.7 hours
      ]
    },
    {
      slot: "evening",
      departures: [
        { time: 18, duration: 260 },  // 6:00 PM, ~4.3 hours
        { time: 19, duration: 320 },  // 7:00 PM, ~5.3 hours
        { time: 20, duration: 380 }   // 8:00 PM, ~6.3 hours
      ]
    }
  ];

  function calculateArrivalTime(departureTime, duration) {
    const arrivalHour = (departureTime + Math.floor(duration / 60)) % 24;
    const arrivalMinutes = duration % 60;
    return {
      hour: arrivalHour,
      minutes: arrivalMinutes,
      isNextDay: (departureTime + Math.floor(duration / 60)) >= 24
    };
  }

  function getRandomTimeSlot() {
    const slot = flightTimeSlots[Math.floor(Math.random() * flightTimeSlots.length)];
    const departure = slot.departures[Math.floor(Math.random() * slot.departures.length)];
    const arrival = calculateArrivalTime(departure.time, departure.duration);
    
    return {
      slot: slot.slot,
      departure_time: departure.time,
      arrival_time: arrival.hour,
      arrival_minutes: arrival.minutes,
      duration: departure.duration,
      isNextDay: arrival.isNextDay
    };
  }

    // Fungsi untuk menghasilkan nilai boolean secara acak
  function getRandomBoolean() {
    return Math.random() < 0.5; // 50% kemungkinan true atau false
  }

  // Memperbarui fungsi getFlightFacilities
  function getFlightFacilities(seatClass) {
    switch (seatClass) {
      case "First Class":
        return {
          meal_available: getRandomBoolean(),
          wifi_available: getRandomBoolean(),
          power_outlets: getRandomBoolean(),
          in_flight_entertainment: getRandomBoolean(),
        };
      case "Business":
        return {
          meal_available: getRandomBoolean(),
          wifi_available: getRandomBoolean(),
          power_outlets: getRandomBoolean(),
          in_flight_entertainment: getRandomBoolean(),
        };
      case "Premium Economy":
        return {
          meal_available: getRandomBoolean(),
          wifi_available: getRandomBoolean(),
          power_outlets: getRandomBoolean(),
          in_flight_entertainment: getRandomBoolean(),
        };
      case "Economy":
      default:
        return {
          meal_available: getRandomBoolean(),
          wifi_available: getRandomBoolean(),
          power_outlets: getRandomBoolean(),
          in_flight_entertainment: getRandomBoolean(),
        };
    }
  }

  function getSeatClassAndPrice(seatId) {
    if (seatId <= 18) {
      return {
        seatClass: "First Class",
        price: 14500000,
        ...getFlightFacilities("First Class")
      };
    } else if (seatId <= 36) {
      return {
        seatClass: "Business",
        price: 9000000,
        ...getFlightFacilities("Business")
      };
    } else if (seatId <= 54) {
      return {
        seatClass: "Premium Economy",
        price: 7500000,
        ...getFlightFacilities("Premium Economy")
      };
    } else {
      return {
        seatClass: "Economy",
        price: 3000000,
        ...getFlightFacilities("Economy")
      };
    }
  }

  function createDateTime(year, month, day, hours, minutes = 0) {
    return new Date(year, month - 1, day, hours, minutes);
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

  async function createFlights(date, route, prisma) {
    const originAirport = airports.find((a) => a.code === route.origin);
    const destAirport = airports.find((a) => a.code === route.destination);
    const originId = airportIds[airports.indexOf(originAirport)];
    const destId = airportIds[airports.indexOf(destAirport)];
    
    const outboundTime = getRandomTimeSlot();
    const discount = generateRandomDiscount();
    
    let arrivalDay = date.date;
    if (outboundTime.isNextDay) {
      arrivalDay += 1;
    }

    const outboundFlight = await prisma.plane.create({
      data: {
        airline_id: airlineIds[Math.floor(Math.random() * airlineIds.length)],
        airport_id_origin: originId,
        airport_id_destination: destId,
        departure_time: createDateTime(
          date.year,
          date.month,
          date.date,
          outboundTime.departure_time,
          0
        ),
        arrival_time: createDateTime(
          date.year,
          date.month,
          arrivalDay,
          outboundTime.arrival_time,
          outboundTime.arrival_minutes
        ),
        departure_terminal: `Terminal ${1 + Math.floor(Math.random() * 3)}`,
        baggage_capacity: 200,
        plane_code: `${route.origin}-${route.destination}-${date.date}${date.month}-${outboundTime.slot}`,
        cabin_baggage_capacity: 10,
        ...getFlightFacilities("Economy"),
        offers: generateOffer(route, discount),
        duration: outboundTime.duration,
      },
    });

    // Calculate return flight time (3-4 hours after arrival)
    const returnDelay = 180 + Math.floor(Math.random() * 60); // 3-4 hours in minutes
    const returnTime = calculateArrivalTime(outboundTime.arrival_time, returnDelay);
    const returnDuration = outboundTime.duration + Math.floor(Math.random() * 60 - 30); // Slightly different duration

    const returnFlight = await prisma.plane.create({
      data: {
        airline_id: airlineIds[Math.floor(Math.random() * airlineIds.length)],
        airport_id_origin: destId,
        airport_id_destination: originId,
        departure_time: createDateTime(
          date.year,
          date.month,
          arrivalDay,
          returnTime.hour,
          returnTime.minutes
        ),
        arrival_time: createDateTime(
          date.year,
          date.month,
          returnTime.isNextDay ? arrivalDay + 1 : arrivalDay,
          (returnTime.hour + Math.floor(returnDuration / 60)) % 24,
          returnTime.minutes + (returnDuration % 60)
        ),
        departure_terminal: `Terminal ${1 + Math.floor(Math.random() * 3)}`,
        baggage_capacity: 200,
        plane_code: `${route.destination}-${route.origin}-${date.date}${date.month}-${outboundTime.slot}-R`,
        cabin_baggage_capacity: 10,
        ...getFlightFacilities("Economy"),
        offers: generateOffer(route, generateRandomDiscount()),
        duration: returnDuration,
      },
    });

    return [outboundFlight, returnFlight];
  }

  const routes = [
    { origin: "JFK", destination: "FRA" },
    { origin: "JFK", destination: "NRT" },
    { origin: "DXB", destination: "LHR" },
    { origin: "SIN", destination: "SYD" },
    { origin: "ZRH", destination: "SVO" },
    { origin: "SIN", destination: "NRT" },
    { origin: "DXB", destination: "SIN" },
    { origin: "LHR", destination: "SYD" },
    { origin: "FRA", destination: "SVO" },
    { origin: "NRT", destination: "SYD" },
    { origin: "LHR", destination: "DXB" },
    { origin: "SVO", destination: "NRT" },
    { origin: "FRA", destination: "SIN" },
    { origin: "JFK", destination: "LHR" },
    { origin: "SYD", destination: "SIN" },
  ];

  const planeIds = [];
  const dates = generateFlightDates(30);

  // Create flights for each date and route
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    
    for (const route of routes) {
      // Create 2-3 flights per route per day
      const numberOfFlights = 2 + Math.floor(Math.random() * 2);
      
      for (let j = 0; j < numberOfFlights; j++) {
        const [outboundFlight, returnFlight] = await createFlights(date, route, prisma);
        planeIds.push(outboundFlight.plane_id, returnFlight.plane_id);
        
        // Create seats for both flights
        for (const flight of [outboundFlight, returnFlight]) {
          for (let seatId = 1; seatId <= 72; seatId++) {
            const seatInfo = getSeatClassAndPrice(seatId);
            await prisma.seat.create({
              data: {
                seat_number: generateSeatNumber(seatId),
                class: seatInfo.seatClass,
                price: seatInfo.price,
                plane_id: flight.plane_id,
                is_available: true,
                version: 0,
              },
            });

            if (seatId === 1) {
              await prisma.plane.update({
                where: { plane_id: flight.plane_id },
                data: getFlightFacilities(seatInfo.seatClass)
              });
            }
          }
        }
      }
    }
  }

  // Create passengers
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

  // Create transactions
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