-- Continent
INSERT INTO "Continent" (name) VALUES 
('Asia'),
('Europe'),
('North America'),
('South America'),
('Africa'),
('Australia'),
('Antarctica');

-- Airport
INSERT INTO "Airport" (name, address, airport_code, image_url, file_id, continent_id) VALUES 
('Soekarno-Hatta International Airport', 'Tangerang, Indonesia', 'CGK', 'https://example.com/cgk.jpg', 'file123', 1),
('Changi Airport', 'Singapore', 'SIN', 'https://example.com/sin.jpg', 'file124', 1),
('Los Angeles International Airport', 'Los Angeles, USA', 'LAX', 'https://example.com/lax.jpg', 'file125', 3),
('Heathrow Airport', 'London, UK', 'LHR', 'https://example.com/lhr.jpg', 'file126', 2),
('Sydney Airport', 'Sydney, Australia', 'SYD', 'https://example.com/syd.jpg', 'file127', 6),
('Cape Town International Airport', 'Cape Town, South Africa', 'CPT', 'https://example.com/cpt.jpg', 'file128', 5),
('Antarctica Research Base Airport', 'Antarctica', 'ARB', 'https://example.com/arb.jpg', 'file129', 7);

-- Airline
INSERT INTO "Airline" (airline_name, image_url, times_used, file_id) VALUES 
('Garuda Indonesia', 'https://example.com/garuda.jpg', 500, 'file201'),
('Singapore Airlines', 'https://example.com/singapore.jpg', 700, 'file202'),
('American Airlines', 'https://example.com/american.jpg', 900, 'file203'),
('British Airways', 'https://example.com/british.jpg', 600, 'file204'),
('Qantas', 'https://example.com/qantas.jpg', 800, 'file205'),
('Ethiopian Airlines', 'https://example.com/ethiopian.jpg', 300, 'file206'),
('Antarctica Flights', 'https://example.com/antarctica.jpg', 50, 'file207');

-- Users
INSERT INTO "Users" (name, telephone_number, email, password, address, gender, identity_number, age, role) VALUES 
('John Doe', '1234567890', 'john.doe@example.com', 'password123', '123 Main St, USA', 'Male', 'ID12345', 30, 'user'),
('Jane Smith', '0987654321', 'jane.smith@example.com', 'password123', '456 Elm St, UK', 'Female', 'ID54321', 28, 'user'),
('Ali Akbar', '08123456789', 'ali.akbar@example.com', 'password123', 'Jakarta, Indonesia', 'Male', 'ID67890', 35, 'user'),
('Lisa Wong', '85212345678', 'lisa.wong@example.com', 'password123', 'Singapore', 'Female', 'ID98765', 32, 'user'),
('Michael Johnson', '61712345678', 'michael.johnson@example.com', 'password123', 'Sydney, Australia', 'Male', 'ID24680', 40, 'user'),
('Sara Ahmed', '20112345678', 'sara.ahmed@example.com', 'password123', 'Cape Town, South Africa', 'Female', 'ID13579', 27, 'user'),
('Emily Davis', '30112345678', 'emily.davis@example.com', 'password123', 'Antarctica Research Base', 'Female', 'ID11223', 29, 'user');

-- Plane
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, plane_code, model, manufacture_year, capacity, baggage_capacity, cabin_baggage_capacity, meal_available, wifi_available, in_flight_entertainment, power_outlets) VALUES 
(1, 1, 2, '2024-12-03 08:00:00', '2024-12-03 12:00:00', 'GA123', 'Boeing 737', 2015, 180, 1500, 300, true, true, 'Movies, Music', true),
(2, 2, 3, '2024-12-04 10:00:00', '2024-12-04 14:00:00', 'SQ456', 'Airbus A380', 2018, 500, 2000, 400, true, true, 'Movies, Music, Games', true),
(3, 3, 4, '2024-12-05 06:00:00', '2024-12-05 12:00:00', 'AA789', 'Boeing 747', 2016, 350, 1800, 350, true, true, 'Movies', false),
(4, 4, 5, '2024-12-06 09:00:00', '2024-12-06 15:00:00', 'BA123', 'Airbus A320', 2017, 200, 1000, 250, true, true, 'Music', true),
(5, 5, 6, '2024-12-07 11:00:00', '2024-12-07 17:00:00', 'QF567', 'Boeing 787', 2019, 220, 1200, 300, true, true, 'Movies, Music', true),
(6, 6, 7, '2024-12-08 07:00:00', '2024-12-08 13:00:00', 'ET234', 'Airbus A350', 2020, 280, 1500, 350, true, false, 'Movies, Music', true),
(7, 7, 1, '2024-12-09 14:00:00', '2024-12-09 20:00:00', 'AF678', 'Boeing 767', 2021, 250, 1300, 300, false, false, 'Documentaries', false);

-- Seat
INSERT INTO "Seat" (class, seat_number, price, plane_id) VALUES 
('Economy', '12A', 150.00, 1),
('Economy', '12B', 150.00, 1),
('Business', '1A', 500.00, 2),
('Business', '1B', 500.00, 2),
('First', '2A', 1000.00, 3),
('First', '2B', 1000.00, 3),
('Economy', '15A', 200.00, 4);

-- Passenger
INSERT INTO "Passenger" (title, name, last_name, nationality, identity_number, issuing_country, valid_until) VALUES 
('Mr', 'John', 'Doe', 'USA', 'ID12345', 'USA', '2030-12-31'),
('Ms', 'Jane', 'Smith', 'UK', 'ID54321', 'UK', '2030-12-31'),
('Mr', 'Ali', 'Akbar', 'Indonesia', 'ID67890', 'Indonesia', '2030-12-31'),
('Ms', 'Lisa', 'Wong', 'Singapore', 'ID98765', 'Singapore', '2030-12-31'),
('Mr', 'Michael', 'Johnson', 'Australia', 'ID24680', 'Australia', '2030-12-31'),
('Ms', 'Sara', 'Ahmed', 'South Africa', 'ID13579', 'South Africa', '2030-12-31'),
('Ms', 'Emily', 'Davis', 'Antarctica', 'ID11223', 'Antarctica', '2030-12-31');

-- Transaction
INSERT INTO "Transaction" (status, redirect_url, transaction_date, token, message, total_payment, user_id) VALUES 
('Completed', 'https://example.com/redirect', '2024-12-01 10:00:00', 'token123', 'Transaction successful', 300.00, 1),
('Pending', 'https://example.com/redirect', '2024-12-02 15:00:00', 'token456', 'Awaiting payment', 150.00, 2),
('Completed', 'https://example.com/redirect', '2024-12-03 12:00:00', 'token789', 'Payment confirmed', 500.00, 3),
('Failed', 'https://example.com/redirect', '2024-12-04 18:00:00', 'token101', 'Payment failed', 100.00, 4),
('Completed', 'https://example.com/redirect', '2024-12-05 09:00:00', 'token202', 'Payment successful', 200.00, 5),
('Pending', 'https://example.com/redirect', '2024-12-06 14:00:00', 'token303', 'Payment required', 400.00, 6),
('Completed', 'https://example.com/redirect', '2024-12-07 11:00:00', 'token404', 'Transaction successful', 700.00, 7);

-- Ticket
INSERT INTO "Ticket" (transaction_id, plane_id, passenger_id, seat_id) VALUES 
(1, 1, 1, 1),
(1, 1, 2, 2),
(2, 2, 3, 3),
(2, 2, 4, 4),
(3, 3, 5, 5),
(3, 3, 6, 6),
(4, 4, 7, 7);

-- Notification
INSERT INTO "Notification" (title, description, user_id) VALUES 
('Booking Confirmed', 'Your booking is confirmed.', 1),
('Payment Reminder', 'Please complete your payment.', 2),
('Booking Cancelled', 'Your booking has been cancelled.', 3),
('Flight Delay', 'Your flight has been delayed.', 4),
('Payment Confirmed', 'Your payment has been confirmed.', 5),
('Flight Rescheduled', 'Your flight has been rescheduled.', 6),
('Booking Reminder', 'Remember to check-in for your flight.', 7);
