const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`
  INSERT INTO "Continent" (name) VALUES ('Asia');
`;

await prisma.$queryRaw`
  INSERT INTO "Continent" (name) VALUES ('Europe');
`;

await prisma.$queryRaw`
  INSERT INTO "Continent" (name) VALUES ('North America');
`;

await prisma.$queryRaw`
  INSERT INTO "Continent" (name) VALUES ('South America');
`;

await prisma.$queryRaw`
  INSERT INTO "Continent" (name) VALUES ('Africa');
`;

await prisma.$queryRaw`
INSERT INTO "Airline" (airline_name, image_url, times_used, file_id) 
VALUES ('Garuda Indonesia', 'https://example.com/garuda.jpg', 0, 'garuda123');
`;

await prisma.$queryRaw`
INSERT INTO "Airline" (airline_name, image_url, times_used, file_id) 
VALUES ('Singapore Airlines', 'https://example.com/singapore.jpg', 0, 'singapore123');
`;

await prisma.$queryRaw`
INSERT INTO "Airline" (airline_name, image_url, times_used, file_id) 
VALUES ('Citilink', 'https://example.com/citilink.jpg', 0, 'citilink123');
`;

await prisma.$queryRaw`
INSERT INTO "Airline" (airline_name, image_url, times_used, file_id) 
VALUES ('Qatar Airways', 'https://example.com/qatar.jpg', 0, 'qatar123');
`;


  // Menambahkan Bandara untuk Asia
await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES 
  ('Soekarno-Hatta International Airport', 'Tangerang, Banten, Indonesia', 'CGK', 'https://example.com/images/cgk.jpg', 'file_id_1', (SELECT continent_id FROM "Continent" WHERE name = 'Asia'));
`;

await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('Changi Airport', 'Singapore 819666', 'SIN', 'https://example.com/images/sin.jpg', 'file_id_2', (SELECT continent_id FROM "Continent" WHERE name = 'Asia'));
`;

// Menambahkan Bandara untuk Eropa
await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('Heathrow Airport', 'Longford, Hounslow, London, United Kingdom', 'LHR', 'https://example.com/images/lhr.jpg', 'file_id_3', (SELECT continent_id FROM "Continent" WHERE name = 'Europe'));
`;

await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('Charles de Gaulle Airport', 'Roissy-en-France, France', 'CDG', 'https://example.com/images/cdg.jpg', 'file_id_4', (SELECT continent_id FROM "Continent" WHERE name = 'Europe'));
`;

// Menambahkan Bandara untuk Amerika Utara
await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('John F. Kennedy International Airport', 'Queens, NY, USA', 'JFK', 'https://example.com/images/jfk.jpg', 'file_id_5', (SELECT continent_id FROM "Continent" WHERE name = 'North America'));
`;

await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('Los Angeles International Airport', 'Westchester, Los Angeles, CA, USA', 'LAX', 'https://example.com/images/lax.jpg', 'file_id_6', (SELECT continent_id FROM "Continent" WHERE name = 'North America'));
`;

// Menambahkan Bandara untuk Amerika Selatan
await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('Sao Paulo–Guarulhos International Airport', 'Guarulhos, São Paulo, Brazil', 'GRU', 'https://example.com/images/gru.jpg', 'file_id_7', (SELECT continent_id FROM "Continent" WHERE name = 'South America'));
`;

await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('El Dorado International Airport', 'Bogotá, Colombia', 'BOG', 'https://example.com/images/bog.jpg', 'file_id_8', (SELECT continent_id FROM "Continent" WHERE name = 'South America'));
`;

// Menambahkan Bandara untuk Afrika
await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('O. R. Tambo International Airport', 'Kempton Park, Johannesburg, South Africa', 'JNB', 'https://example.com/images/jnb.jpg', 'file_id_9', (SELECT continent_id FROM "Continent" WHERE name = 'Africa'));
`;

await prisma.$queryRaw`
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id)
VALUES
  ('Cape Town International Airport', 'Cape Town, South Africa', 'CPT', 'https://example.com/images/cpt.jpg', 'file_id_10', (SELECT continent_id FROM "Continent" WHERE name = 'Africa'));
`;



  // Menambahkan Pesawat untuk Garuda Indonesia
await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia'), 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 1', 20, 'PGA1', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia'), 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 2', 30, 'PGA2', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia'), 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 3', 20, 'PGA3', 10, true, true, true, true, 'Special offers available', 120);
`;

// Menambahkan Pesawat untuk Singapore Airlines
await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines'), 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 1', 20, 'PSA1', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines'), 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 2', 20, 'PSA2', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines'), 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 3', 30, 'PSA3', 10, true, true, true, true, 'Special offers available', 120);
`;

// Menambahkan Pesawat untuk Citilink
await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink'), 5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 1', 20, 'CTA1', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink'), 5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 2', 30, 'CTA2', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink'), 5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 3', 30, 'CTA3', 10, true, true, true, true, 'Special offers available', 120);
`;

// Menambahkan Pesawat untuk Qatar Airways
await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways'), 8, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 1', 30, 'QTA1', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways'), 8, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 2', 30, 'QTA2', 10, true, true, true, true, 'Special offers available', 120);
`;

await prisma.$queryRaw`
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, departure_terminal, baggage_capacity, plane_code, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets, offers, duration)
VALUES
  ((SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways'), 8, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Terminal 3', 20, 'QTA3', 10, true, true, true, true, 'Special offers available', 120);
`;



 // Kursi First Class untuk Garuda Indonesia
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'First Class', CONCAT('F', ROW_NUMBER() OVER (ORDER BY plane_id)), 600, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia')
LIMIT 6;
`;

// Kursi Business Class untuk Garuda Indonesia
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Business', CONCAT('B', ROW_NUMBER() OVER (ORDER BY plane_id)), 350, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia')
LIMIT 12;
`;

// Kursi Economy Premium untuk Garuda Indonesia
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy Premium', CONCAT('E', ROW_NUMBER() OVER (ORDER BY plane_id)), 200, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia')
LIMIT 18;
`;

// Kursi Economy Class untuk Garuda Indonesia
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy', CONCAT('Y', ROW_NUMBER() OVER (ORDER BY plane_id)), 120, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Garuda Indonesia')
LIMIT 32;
`;


 // Kursi First Class untuk Singapore Airlines
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'First Class', CONCAT('F', ROW_NUMBER() OVER (ORDER BY plane_id)), 650, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines')
LIMIT 6;
`;

// Kursi Business Class untuk Singapore Airlines
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Business', CONCAT('B', ROW_NUMBER() OVER (ORDER BY plane_id)), 400, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines')
LIMIT 12;
`;

// Kursi Economy Premium untuk Singapore Airlines
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy Premium', CONCAT('E', ROW_NUMBER() OVER (ORDER BY plane_id)), 220, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines')
LIMIT 18;
`;

// Kursi Economy Class untuk Singapore Airlines
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy', CONCAT('Y', ROW_NUMBER() OVER (ORDER BY plane_id)), 130, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Singapore Airlines')
LIMIT 32;
`;

 // Kursi First Class untuk Citilink
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'First Class', CONCAT('F', ROW_NUMBER() OVER (ORDER BY plane_id)), 550, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink')
LIMIT 6;
`;

// Kursi Business Class untuk Citilink
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Business', CONCAT('B', ROW_NUMBER() OVER (ORDER BY plane_id)), 300, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink')
LIMIT 12;
`;

// Kursi Economy Premium untuk Citilink
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy Premium', CONCAT('E', ROW_NUMBER() OVER (ORDER BY plane_id)), 180, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink')
LIMIT 18;
`;

// Kursi Economy Class untuk Citilink
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy', CONCAT('Y', ROW_NUMBER() OVER (ORDER BY plane_id)), 100, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Citilink')
LIMIT 32;
`;


  // Kursi First Class untuk Qatar Airways
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'First Class', CONCAT('F', ROW_NUMBER() OVER (ORDER BY plane_id)), 800, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways')
LIMIT 6;
`;

// Kursi Business Class untuk Qatar Airways
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Business', CONCAT('B', ROW_NUMBER() OVER (ORDER BY plane_id)), 500, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways')
LIMIT 12;
`;

// Kursi Economy Premium untuk Qatar Airways
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy Premium', CONCAT('E', ROW_NUMBER() OVER (ORDER BY plane_id)), 250, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways')
LIMIT 18;
`;

// Kursi Economy Class untuk Qatar Airways
await prisma.$queryRaw`
INSERT INTO "Seat" (class, seat_number, price, plane_id)
SELECT 'Economy', CONCAT('Y', ROW_NUMBER() OVER (ORDER BY plane_id)), 150, plane_id
FROM "Plane"
WHERE airline_id = (SELECT airline_id FROM "Airline" WHERE airline_name = 'Qatar Airways')
LIMIT 32;
`;
// Menambahkan Data User 1
await prisma.$queryRaw`
  INSERT INTO "Users" (name, telephone_number, email, password, address, gender, identity_number, age, role, otp, otp_expiry, reset_token, verified)
  VALUES ('John Doe', '081234567890', 'johndoe@example.com', 'hashed_password', '1234 Elm Street', 'Male', '1234567890123456', 30, 'User', NULL, NULL, NULL, TRUE);
`;

// Menambahkan Data User 2
await prisma.$queryRaw`
  INSERT INTO "Users" (name, telephone_number, email, password, address, gender, identity_number, age, role, otp, otp_expiry, reset_token, verified)
  VALUES ('Jane Doe', '082345678901', 'janedoe@example.com', 'hashed_password', '5678 Oak Street', 'Female', '2345678901234567', 28, 'User', NULL, NULL, NULL, TRUE);
`;

// Menambahkan Data Notification untuk John Doe
await prisma.$queryRaw`
  INSERT INTO "Notification" (title, description, user_id)
  VALUES ('Account Verification', 'Please verify your account.', (SELECT user_id FROM "Users" WHERE email = 'johndoe@example.com'));
`;

// Menambahkan Data Notification untuk Jane Doe
await prisma.$queryRaw`
  INSERT INTO "Notification" (title, description, user_id)
  VALUES ('New Flight Booking', 'Your flight has been successfully booked.', (SELECT user_id FROM "Users" WHERE email = 'janedoe@example.com'));
`;




  console.log('Data successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
