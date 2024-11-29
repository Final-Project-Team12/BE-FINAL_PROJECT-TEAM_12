-- Insert Continents
INSERT INTO "Continent" (name) VALUES
('Asia'),
('Europe'),
('North America'),
('South America'),
('Africa'),
('Australia'),
('Antarctica');

-- Insert Airports
INSERT INTO "Airport" (name, address, airport_code, times_visited, continent_id) VALUES
('Soekarno-Hatta International Airport', 'Tangerang, Indonesia', 'CGK', 150, 1),
('Changi Airport', 'Singapore', 'SIN', 200, 1),
('Heathrow Airport', 'London, UK', 'LHR', 250, 2),
('John F. Kennedy International Airport', 'New York, USA', 'JFK', 300, 3),
('Dubai International Airport', 'Dubai, UAE', 'DXB', 180, 1),
('Los Angeles International Airport', 'Los Angeles, USA', 'LAX', 400, 3),
('Tokyo Narita International Airport', 'Narita, Japan', 'NRT', 220, 1),
('Paris Charles de Gaulle Airport', 'Paris, France', 'CDG', 350, 2),
('Sydney Kingsford Smith Airport', 'Sydney, Australia', 'SYD', 120, 6),
('Cairo International Airport', 'Cairo, Egypt', 'CAI', 160, 5);

-- Insert Airlines
INSERT INTO "Airline" (airline_name, image_url, times_used) VALUES
('Garuda Indonesia', 'https://example.com/garuda.jpg', 1000),
('Singapore Airlines', 'https://example.com/singapore.jpg', 850),
('Emirates', 'https://example.com/emirates.jpg', 920),
('British Airways', 'https://example.com/british.jpg', 780),
('American Airlines', 'https://example.com/american.jpg', 890),
('Qantas Airways', 'https://example.com/qantas.jpg', 950),
('Lufthansa', 'https://example.com/lufthansa.jpg', 1100),
('Air France', 'https://example.com/airfrance.jpg', 870),
('Delta Airlines', 'https://example.com/delta.jpg', 920),
('KLM Royal Dutch Airlines', 'https://example.com/klm.jpg', 880);

-- Insert Planes
INSERT INTO "Plane" (airline_id, airport_id_origin, airport_id_destination, departure_time, arrival_time, plane_code) VALUES
(1, 1, 2, '2024-11-25 08:00:00', '2024-11-25 10:00:00', 'GA-100'),
(2, 2, 3, '2024-11-25 09:00:00', '2024-11-25 15:00:00', 'SQ-200'),
(3, 5, 1, '2024-11-25 10:00:00', '2024-11-25 15:00:00', 'EK-300'),
(4, 3, 4, '2024-11-25 11:00:00', '2024-11-25 19:00:00', 'BA-400'),
(5, 4, 5, '2024-11-25 12:00:00', '2024-11-25 22:00:00', 'AA-500'),
(6, 6, 1, '2024-11-26 09:00:00', '2024-11-26 14:00:00', 'QF-600'),
(7, 7, 2, '2024-11-26 10:00:00', '2024-11-26 16:00:00', 'LH-700'),
(8, 8, 3, '2024-11-26 11:00:00', '2024-11-26 18:00:00', 'AF-800'),
(9, 9, 4, '2024-11-26 12:00:00', '2024-11-26 20:00:00', 'DL-900'),
(10, 10, 5, '2024-11-26 13:00:00', '2024-11-26 21:00:00', 'KL-1000');

-- Insert Seats
INSERT INTO "Seat" (class, seat_number, price, plane_id) VALUES
('Economy', 'A1', 500.00, 1),
('Business', 'B1', 1500.00, 2),
('First Class', 'F1', 3000.00, 3),
('Economy', 'A2', 550.00, 4),
('Business', 'B2', 1600.00, 5),
('Economy', 'A3', 600.00, 6),
('First Class', 'F2', 3500.00, 7),
('Business', 'B3', 1800.00, 8),
('Economy', 'A4', 650.00, 9),
('First Class', 'F3', 4000.00, 10);

-- Insert Users
INSERT INTO "Users" (name, telephone_number, email, password, address, gender, identity_number, age, role, otp) VALUES
('John Doe', '+1234567890', 'john@example.com', 'hashedpass1', '123 Main St', 'Male', '1234567890', 30, 'user', '123456'),
('Jane Smith', '+2345678901', 'jane@example.com', 'hashedpass2', '456 Oak St', 'Female', '2345678901', 25, 'user', '234567'),
('Bob Johnson', '+3456789012', 'bob@example.com', 'hashedpass3', '789 Pine St', 'Male', '3456789012', 35, 'admin', '345678'),
('Alice Brown', '+4567890123', 'alice@example.com', 'hashedpass4', '321 Elm St', 'Female', '4567890123', 28, 'user', '456789'),
('Charlie Wilson', '+5678901234', 'charlie@example.com', 'hashedpass5', '654 Maple St', 'Male', '5678901234', 40, 'user', '567890'),
('Emily Davis', '+6789012345', 'emily@example.com', 'hashedpass6', '987 Cedar St', 'Female', '6789012345', 22, 'user', '678901'),
('David Lee', '+7890123456', 'david@example.com', 'hashedpass7', '654 Birch St', 'Male', '7890123456', 45, 'user', '789012'),
('Sophia Martinez', '+8901234567', 'sophia@example.com', 'hashedpass8', '321 Oak St', 'Female', '8901234567', 32, 'user', '890123'),
('Liam Robinson', '+9012345678', 'liam@example.com', 'hashedpass9', '456 Pine St', 'Male', '9012345678', 29, 'admin', '901234'),
('Olivia Johnson', '+1122334455', 'olivia@example.com', 'hashedpass10', '789 Maple St', 'Female', '1122334455', 38, 'user', '112233');

-- Insert Notifications
INSERT INTO "Notification" (title, description, user_id) VALUES
('Welcome!', 'Welcome to our platform', 1),
('Booking Confirmed', 'Your flight has been booked', 2),
('Payment Received', 'Payment processed successfully', 3),
('Flight Update', 'Your flight schedule has changed', 4),
('Special Offer', 'New discounts available', 5),
('Booking Confirmation', 'Your booking has been confirmed', 6),
('Flight Delayed', 'Your flight is delayed by 1 hour', 7),
('Payment Failed', 'Payment was not successful', 8),
('New Flight Available', 'New flights are now available for booking', 9),
('Account Verified', 'Your account has been verified successfully', 10);

-- Insert Passengers
INSERT INTO "Passenger" (title, name, last_name, nationality, identity_number, issuing_country, valid_until) VALUES
('Mr', 'John', 'Doe', 'American', 'US123456', 'USA', '2025-12-31'),
('Mrs', 'Jane', 'Smith', 'British', 'UK234567', 'UK', '2026-01-31'),
('Mr', 'Bob', 'Johnson', 'Canadian', 'CA345678', 'Canada', '2025-11-30'),
('Ms', 'Alice', 'Brown', 'Australian', 'AU456789', 'Australia', '2026-02-28'),
('Mr', 'Charlie', 'Wilson', 'German', 'DE567890', 'Germany', '2025-10-31'),
('Ms', 'Emily', 'Davis', 'American', 'US678901', 'USA', '2026-05-15'),
('Mr', 'David', 'Lee', 'British', 'UK789012', 'UK', '2025-09-21'),
('Mrs', 'Sophia', 'Martinez', 'Mexican', 'MX890123', 'Mexico', '2025-07-10'),
('Mr', 'Liam', 'Robinson', 'Australian', 'AU901234', 'Australia', '2026-03-25'),
('Ms', 'Olivia', 'Johnson', 'Canadian', 'CA112233', 'Canada', '2026-11-12');

-- Insert Transactions
INSERT INTO "Transaction" (status, redirect_url, transaction_date, token, message, total_payment, user_id) VALUES
('SUCCESS', 'https://payment.com/success1', '2024-11-24 08:00:00', 'tok_1', 'Payment successful', 500.00, 1),
('PENDING', 'https://payment.com/pending2', '2024-11-24 09:00:00', 'tok_2', 'Payment pending', 1500.00, 2),
('SUCCESS', 'https://payment.com/success3', '2024-11-24 10:00:00', 'tok_3', 'Payment successful', 3000.00, 3),
('FAILED', 'https://payment.com/failed4', '2024-11-24 11:00:00', 'tok_4', 'Payment failed', 550.00, 4),
('SUCCESS', 'https://payment.com/success5', '2024-11-24 12:00:00', 'tok_5', 'Payment successful', 1600.00, 5),
('PENDING', 'https://payment.com/pending6', '2024-11-24 13:00:00', 'tok_6', 'Payment pending', 1200.00, 6),
('SUCCESS', 'https://payment.com/success7', '2024-11-24 14:00:00', 'tok_7', 'Payment successful', 1900.00, 7),
('FAILED', 'https://payment.com/failed8', '2024-11-24 15:00:00', 'tok_8', 'Payment failed', 800.00, 8),
('SUCCESS', 'https://payment.com/success9', '2024-11-24 16:00:00', 'tok_9', 'Payment successful', 1100.00, 9),
('PENDING', 'https://payment.com/pending10', '2024-11-24 17:00:00', 'tok_10', 'Payment pending', 1450.00, 10);

-- Insert Tickets
INSERT INTO "Ticket" (transaction_id, plane_id, passenger_id, seat_id) VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5),
(6, 6, 6, 6),
(7, 7, 7, 7),
(8, 8, 8, 8),
(9, 9, 9, 9),
(10, 10, 10, 10);
