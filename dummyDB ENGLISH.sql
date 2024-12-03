-- Insert into Continent table
INSERT INTO "Continent" ("name") 
VALUES ('Asia'),
       ('Europe'),
       ('North America'),
       ('South America'),
       ('Africa'),
       ('Australia'),
       ('Antarctica');

-- Insert into Airport table
INSERT INTO "Airport" ("name", "address", "airport_code", "continent_id") 
VALUES 
  ('Tokyo International', 'Tokyo, Japan', 'HND', 1),
  ('London Heathrow', 'London, UK', 'LHR', 2),
  ('Los Angeles International', 'Los Angeles, USA', 'LAX', 3),
  ('São Paulo International', 'São Paulo, Brazil', 'GRU', 4),
  ('Cairo International', 'Cairo, Egypt', 'CAI', 5),
  ('Sydney Kingsford Smith', 'Sydney, Australia', 'SYD', 6),
  ('McMurdo Station', 'Antarctica', 'MSA', 7);

-- Insert into Airline table
INSERT INTO "Airline" ("airline_name", "image_url", "times_used", "file_id") 
VALUES 
  ('Airways X', 'https://airwaysx.com/logo.png', 100, 'airwaysx-file-001'),
  ('EuroFly', 'https://eurofly.com/logo.png', 150, 'eurofly-file-002'),
  ('Pacific Airlines', 'https://pacificairlines.com/logo.png', 80, 'pacific-file-003'),
  ('SouthWind Airlines', 'https://southwind.com/logo.png', 50, 'southwind-file-004'),
  ('FlyAfrica', 'https://flyafrica.com/logo.png', 120, 'flyafrica-file-005'),
  ('Aussie Air', 'https://aussieair.com/logo.png', 90, 'aussie-file-006'),
  ('Polar Airlines', 'https://polarairlines.com/logo.png', 10, 'polar-file-007');

-- Insert into Plane table
INSERT INTO "Plane" ("airline_id", "airport_id_origin", "airport_id_destination", "departure_time", "arrival_time", "plane_code") 
VALUES 
  (1, 1, 2, NOW(), NOW(), 'PX123'),
  (2, 2, 3, NOW(), NOW(), 'EF456'),
  (3, 3, 4, NOW(), NOW(), 'PA789'),
  (4, 4, 5, NOW(), NOW(), 'SW012'),
  (5, 5, 6, NOW(), NOW(), 'FA345'),
  (6, 6, 7, NOW(), NOW(), 'AA678'),
  (7, 7, 1, NOW(), NOW(), 'PA901');

-- Insert into Seat table
INSERT INTO "Seat" ("class", "seat_number", "price", "plane_id") 
VALUES 
  ('Economy', '12A', 500.0, 1),
  ('Business', '2B', 1500.0, 2),
  ('First', '1A', 2500.0, 3),
  ('Economy', '16C', 450.0, 4),
  ('Economy', '22D', 400.0, 5),
  ('Business', '3E', 1200.0, 6),
  ('First', '1F', 3000.0, 7);

-- Insert into Users table
INSERT INTO "Users" ("name", "telephone_number", "email", "password", "address", "gender", "identity_number", "age", "role") 
VALUES 
  ('John Doe', '123-456-7890', 'johndoe@example.com', 'password123', '123 Main St, City, Country', 'Male', 'ID1234567890', 30, 'User'),
  ('Jane Smith', '234-567-8901', 'janesmith@example.com', 'password456', '456 Maple St, City, Country', 'Female', 'ID2345678901', 28, 'Admin'),
  ('Robert Brown', '345-678-9012', 'robertbrown@example.com', 'password789', '789 Oak St, City, Country', 'Male', 'ID3456789012', 35, 'User'),
  ('Mary Johnson', '456-789-0123', 'maryjohnson@example.com', 'password101', '123 Pine St, City, Country', 'Female', 'ID4567890123', 27, 'User'),
  ('David White', '567-890-1234', 'davidwhite@example.com', 'password202', '456 Birch St, City, Country', 'Male', 'ID5678901234', 40, 'User'),
  ('Sarah Lee', '678-901-2345', 'sarahlee@example.com', 'password303', '789 Cedar St, City, Country', 'Female', 'ID6789012345', 32, 'User'),
  ('James Wilson', '789-012-3456', 'jameswilson@example.com', 'password404', '123 Elm St, City, Country', 'Male', 'ID7890123456', 45, 'Admin');

-- Insert into Notification table
INSERT INTO "Notification" ("title", "description", "user_id") 
VALUES 
  ('Welcome to Our Service', 'Thank you for signing up, John Doe!', 1),
  ('Account Update', 'Your account has been updated successfully.', 2),
  ('Flight Confirmation', 'Your flight from Tokyo to London has been confirmed.', 3),
  ('Payment Reminder', 'Please complete your payment for your upcoming flight.', 4),
  ('Special Offer', 'Enjoy 20% off on your next flight with Airways X.', 5),
  ('Flight Delay', 'Your flight from Sydney to McMurdo Station has been delayed.', 6),
  ('Account Suspended', 'Your account has been suspended due to unusual activity.', 7);

-- Insert into Transaction table
INSERT INTO "Transaction" ("status", "redirect_url", "transaction_date", "token", "message", "total_payment", "user_id") 
VALUES 
  ('Completed', 'https://example.com/redirect', NOW(), 'txn_token_001', 'Payment successful', 500.0, 1),
  ('Pending', 'https://example.com/redirect', NOW(), 'txn_token_002', 'Awaiting confirmation', 1500.0, 2),
  ('Failed', 'https://example.com/redirect', NOW(), 'txn_token_003', 'Payment failed', 2500.0, 3),
  ('Completed', 'https://example.com/redirect', NOW(), 'txn_token_004', 'Payment successful', 450.0, 4),
  ('Pending', 'https://example.com/redirect', NOW(), 'txn_token_005', 'Awaiting confirmation', 400.0, 5),
  ('Completed', 'https://example.com/redirect', NOW(), 'txn_token_006', 'Payment successful', 1200.0, 6),
  ('Failed', 'https://example.com/redirect', NOW(), 'txn_token_007', 'Payment failed', 3000.0, 7);

-- Insert into Passenger table
INSERT INTO "Passenger" ("title", "name", "last_name", "nationality", "identity_number", "issuing_country", "valid_until") 
VALUES 
  ('Mr.', 'John', 'Doe', 'American', 'ID12345', 'USA', '2025-12-31'),
  ('Ms.', 'Jane', 'Smith', 'British', 'ID23456', 'UK', '2026-05-15'),
  ('Mr.', 'Robert', 'Brown', 'Canadian', 'ID34567', 'Canada', '2027-02-28'),
  ('Ms.', 'Mary', 'Johnson', 'Australian', 'ID45678', 'Australia', '2025-07-21'),
  ('Mr.', 'David', 'White', 'Egyptian', 'ID56789', 'Egypt', '2024-11-01'),
  ('Ms.', 'Sarah', 'Lee', 'Chinese', 'ID67890', 'China', '2026-03-05'),
  ('Mr.', 'James', 'Wilson', 'American', 'ID78901', 'USA', '2027-08-19');
  
-- Insert into Ticket table
INSERT INTO "Ticket" ("transaction_id", "plane_id", "passenger_id", "seat_id") 
VALUES 
  (1, 1, 1, 1),
  (2, 2, 2, 2),
  (3, 3, 3, 3),
  (4, 4, 4, 4),
  (5, 5, 5, 5),
  (6, 6, 6, 6),
  (7, 7, 7, 7);

-- Insert into Payment table
INSERT INTO "Payment" ("orderId", "status", "transactionId", "amount", "snapToken", "customerName", "customerEmail", "customerPhone", "customerAddress") 
VALUES 
  ('order123', 'Completed', 'txn_token_001', 500.0, 'snapToken123', 'John Doe', 'johndoe@example.com', '123-456-7890', '123 Main St, City, Country'),
  ('order124', 'Pending', 'txn_token_002', 1500.0, 'snapToken124', 'Jane Smith', 'janesmith@example.com', '234-567-8901', '456 Maple St, City, Country'),
  ('order125', 'Failed', 'txn_token_003', 2500.0, 'snapToken125', 'Robert Brown', 'robertbrown@example.com', '345-678-9012', '789 Oak St, City, Country'),
  ('order126', 'Completed', 'txn_token_004', 450.0, 'snapToken126', 'Mary Johnson', 'maryjohnson@example.com', '456 Birch St, City, Country', '123 Pine St, City, Country'),
  ('order127', 'Pending', 'txn_token_005', 400.0, 'snapToken127', 'David White', 'davidwhite@example.com', '567-890-1234', '789 Cedar St, City, Country'),
  ('order128', 'Completed', 'txn_token_006', 1200.0, 'snapToken128', 'Sarah Lee', 'sarahlee@example.com', '678-901-2345', '123 Elm St, City, Country'),
  ('order129', 'Failed', 'txn_token_007', 3000.0, 'snapToken129', 'James Wilson', 'jameswilson@example.com', '789-012-3456', '123 Oak St, City, Country');
