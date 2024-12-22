# Flight Booking System Documentation

# Flight Booking System Documentation

## Table of Contents
- [Backend Team](#backend-team)
- [Project Overview](#project-overview)
  - [Key Features](#key-features)
- [Technology Stack](#technology-stack)
  - [Backend Technologies](#backend-technologies)
- [Project Setup](#project-setup)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
  - [Overview](#overview)
  - [Authentication](#authentication)
  - [Base URL](#base-url)
  - [API Endpoints](#api-endpoints)
    - [User Management](#user-management)
    - [Password Management](#password-management)
    - [Flight Management](#flight-management)
    - [Transaction Management](#transaction-management)
    - [Payment Management](#payment-management)
    - [Notification Management](#notification-management)
    - [Airport Management (Admin)](#airport-management-admin)
    - [Airline Management (Admin)](#airline-management-admin)
    - [OAuth Integration](#oauth-integration)
  - [Error Handling](#error-handling)
  - [Sample Requests](#sample-requests)
- [Database Schema](#database-schema)
  - [Core Models](#core-models)
  - [Transaction Related Models](#transaction-related-models)
  - [Flight Related Models](#flight-related-models)
  - [Airport and Airline Models](#airport-and-airline-models)
  - [Entity Relationships](#entity-relationships)
  - [Database Migration](#database-migration)
- [Testing](#testing)
  - [Running Tests](#running-tests)

## Team Information

### Backend Team
| Name | Role |
|------|------|
| Zefanya Diego Forlandicco | Backend Developer |
| Wahyu Pinanda Ginting | Backend Developer |
| Cornellius Barros Kangga | Backend Developer |
| Alif Naufal Taufiqi | Backend Developer |

### Project Management
For tasks and progress tracking: [ClickUp Tasks](https://app.clickup.com/9018681465/v/b/8crwa3t-458)

[Rest of the content follows the same structure as provided in your file...]

## Project Overview

Our Flight Booking System is a comprehensive solution that enables users to:
- Search and book flights
- Manage bookings
- Process payments
- Receive notifications
- Manage user profiles
  
 User Management
- Email-based authentication
- Google OAuth integration
- JWT token-based sessions
- Password recovery system
- OTP verification

#### Flight Management
- Advanced flight search
- Multi-city routing
- Fare comparison
- Seat selection
- Real-time availability

#### Booking System
- Secure payment processing
- Multiple payment methods
- Booking confirmation
- E-ticket generation

## Backend Team

### **Backend Team Documentation**

| **Name**                 |
|-------------------------|
| **Zefanya Diego Forlandicco** |
| **Wahyu Pinanda Ginting**    |
| **Cornellius Barros Kangga**      |
| **Alif Naufal Taufiqi**|

For tasks and progress, visit our ClickUp workspace: [ClickUp Tasks](https://app.clickup.com/9018681465/v/b/8crwa3t-458)
## Technology Stack
### Backend
- Node.js
- Express.js
- PostgreSQL
- EC2
- Sequelize ORM
- JSON Web Tokens (JWT)
- Nodemailer
- Midtrans Payment Gateway

### Key Features
- User authentication with email verification
- Flight search with multiple filters
- Secure payment processing
- Booking management
- Admin dashboard for system management
- Real-time notifications
- Google OAuth integration

## Project Setup
Follow these steps to run the frontend project locally:

1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12
   ```

2. Navigate to the project directory:
   ```bash
   cd BE-FINAL_PROJECT-TEAM_12
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
5. Create `.env` file:
```env
# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=your_db_host

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass

# Payment Gateway
MIDTRANS_SERVER_KEY=your_midtrans_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
## API Documentation

### Overview

This API provides functionality for a flight booking system, including user management, flight search, booking, payments, and administrative functions.

### Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Base URL
```
{{url}}/api/v1
```

### API Endpoints

#### User Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/user` | POST | Register new user | No |
| `/user/verify` | POST | Verify user account | No |
| `/user/resend` | POST | Resend OTP | No |
| `/user/login` | POST | User login | No |
| `/user/:id` | PUT | Update user profile | Yes |
| `/user/:id` | GET | Get user details | Yes |
| `/user/:id` | DELETE | Delete user account | Yes |

#### Password Management
| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/password/forgot-password` | POST | Request password reset | No |
| `/password/confirm-otp` | POST | Confirm OTP for password reset | No |
| `/password/reset-password` | POST | Reset password | No |

#### Flight Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/flights` | GET | Get all flights | No |
| `/flights/search` | GET | Search flights with filters | No |

##### Search Parameters
| Parameter | Description | Example |
|-----------|-------------|---------|
| `from` | Departure airport code | `FRA` |
| `to` | Arrival airport code | `NBO` |
| `departureDate` | Departure date | `2024-12-08` |
| `returnDate` | Return date (optional) | `2024-12-11` |
| `seatClass` | Class type | `Economy` |
| `passengerAdult` | Number of adult passengers | `2` |
| `passengerChild` | Number of child passengers | `1` |
| `passengerInfant` | Number of infant passengers | `1` |

##### Sorting Parameters
| Parameter | Values | Description |
|-----------|---------|-------------|
| `priceSort` | `Cheapest`, `Expensive` | Sort by price |
| `departureSort` | `First`, `Last` | Sort by departure time |
| `arrivalSort` | `First`, `Last` | Sort by arrival time |
| `durationSort` | `Shortest`, `Longest` | Sort by flight duration |

#### Transaction Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/transaction` | POST | Create new transaction | Yes |
| `/transaction/user/:id` | GET | Get user's transactions | Yes |

#### Payment Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/payments` | POST | Create payment | Yes |
| `/payments/:orderId/status` | GET | Check payment status | Yes |
| `/payments/:orderId/cancel` | POST | Cancel payment | Yes |

#### Notification Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/notifications` | GET | Get all notifications | Yes |
| `/notifications/:id` | GET | Get specific notification | Yes |
| `/notifications/user/:id` | GET | Get user's notifications | Yes |
| `/notifications` | POST | Create notification | Yes |
| `/notifications/:id` | DELETE | Delete notification | Yes |

#### Airport Management (Admin)

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/airport` | GET | Get all airports | Yes (Admin) |
| `/airport/:id` | GET | Get airport by ID | Yes (Admin) |
| `/airport` | POST | Create new airport | Yes (Admin) |
| `/airport/:id` | PUT | Update airport | Yes (Admin) |
| `/airport/:id` | DELETE | Delete airport | Yes (Admin) |

#### Airline Management (Admin)

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|------------------------|
| `/airline` | GET | Get all airlines | Yes (Admin) |
| `/airline/:id` | GET | Get airline by ID | Yes (Admin) |
| `/airline` | POST | Create new airline | Yes (Admin) |
| `/airline/:id` | PUT | Update airline | Yes (Admin) |
| `/airline/:id` | DELETE | Delete airline | Yes (Admin) |

### OAuth Integration

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/auth/google` | GET | Initiate Google OAuth flow |
| `/auth/google/password` | PUT | Set password after OAuth login |

### Error Handling

The API returns standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Sample Requests

#### Create Transaction
```json
{
    "userData": {
        "user_id": 11
    },
    "passengerData": [
        {
            "title": "Mr",
            "full_name": "Harry Potter",
            "family_name": "Potter",
            "nationality": "Indonesia",
            "id_number": "1234567890",
            "id_issuer": "Indonesia",
            "id_expiry": "2025-01-01",
            "birth_date": "2000-01-01"
        }
    ],
    "seatSelections": [
        { "seat_id": 13 }
    ],
    "planeId": 7
}
```

#### Create Payment
```json
{
   "orderId": "8v05uu",
   "amount": 1000000,
   "customerDetails": {
     "name": "John Doe",
     "email": "john@example.com",
     "mobile_number": "081122334455",
     "address": "123 Main St"
   },
   "productDetails": [
     {
       "productId": "TICKET-11",
       "productName": "Flight Ticket Australia-South Africa",
       "quantity": 1,
       "price": 1000000
     }
   ]
}
```
#### User Schema
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "address": "string"
}
```

#### Flight Search Schema
```json
{
  "from": "string",
  "to": "string",
  "departureDate": "YYYY-MM-DD",
  "returnDate": "YYYY-MM-DD",
  "passengers": {
    "adult": "number",
    "child": "number",
    "infant": "number"
  },
  "class": "Economy|Business|First"
}
```
## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- users.test.js

# Run with coverage report
npm run test:coverage
```
## Database Schema

Our system uses PostgreSQL with Prisma as the ORM. Below are the detailed schema definitions for each model:

### Core Models

#### Users
```prisma
model Users {
  user_id          Int            @id @default(autoincrement())
  name             String
  telephone_number String
  email            String         @unique
  password         String
  address          String
  gender           String
  identity_number  String
  age              Int
  role             String
  otp              String?
  otp_expiry       String?
  reset_token      String?
  verified         Boolean        @default(false)
  notifications    Notification[]
  transactions     Transaction[]
}
```

#### Notification
```prisma
model Notification {
  notification_id   Int      @id @default(autoincrement())
  title            String
  description      String
  notification_date DateTime
  user_id          Int
  user             Users    @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  is_read          Boolean  @default(false)
}
```

### Transaction Related Models

#### Transaction
```prisma
model Transaction {
  transaction_id   Int      @id @default(autoincrement())
  status           String
  redirect_url     String
  transaction_date DateTime
  token            String
  message          String
  base_amount      Float
  tax_amount       Float
  total_payment    Float
  user_id          Int
  user             Users    @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  tickets          Ticket[]
}
```

#### Ticket
```prisma
model Ticket {
  ticket_id      Int         @id @default(autoincrement())
  transaction_id Int
  plane_id       Int
  passenger_id   Int
  seat_id        Int
  transaction    Transaction @relation(fields: [transaction_id], references: [transaction_id], onDelete: Cascade)
  passenger      Passenger   @relation(fields: [passenger_id], references: [passenger_id])
  seat           Seat        @relation(fields: [seat_id], references: [seat_id])
  plane          Plane       @relation(fields: [plane_id], references: [plane_id])
  created_at     DateTime    @default(now())
  updated_at     DateTime    @updatedAt
}
```

### Flight Related Models

#### Passenger
```prisma
model Passenger {
  passenger_id Int       @id @default(autoincrement())
  title        String
  full_name    String
  family_name  String?
  birth_date   DateTime?
  nationality  String
  id_number    String?
  id_issuer    String?
  id_expiry    DateTime?
  tickets      Ticket[]
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt
}
```

#### Seat
```prisma
model Seat {
  seat_id      Int      @id @default(autoincrement())
  seat_number  String
  class        String
  price        Int
  plane_id     Int
  is_available Boolean  @default(true)
  version      Int      @default(0)
  plane        Plane    @relation(fields: [plane_id], references: [plane_id])
  tickets      Ticket[]
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}
```

#### Plane
```prisma
model Plane {
  plane_id                Int      @id @default(autoincrement())
  airline_id              Int
  airport_id_origin       Int
  airport_id_destination  Int
  departure_time          DateTime
  arrival_time           DateTime
  departure_terminal      String
  baggage_capacity        Float
  plane_code              String
  cabin_baggage_capacity  Float
  meal_available          Boolean
  wifi_available          Boolean
  in_flight_entertainment Boolean
  power_outlets           Boolean
  offers                  String
  duration                Int
  airline                 Airline  @relation(fields: [airline_id], references: [airline_id])
  origin_airport          Airport  @relation("OriginAirport", fields: [airport_id_origin], references: [airport_id])
  destination_airport     Airport  @relation("DestinationAirport", fields: [airport_id_destination], references: [airport_id])
  seats                   Seat[]
  tickets                 Ticket[]
}
```

### Airport and Airline Models

#### Airline
```prisma
model Airline {
  airline_id   Int     @id @default(autoincrement())
  airline_name String
  image_url    String
  times_used   Int     @default(0)
  file_id      String  @unique
  planes       Plane[]
}
```

#### Airport
```prisma
model Airport {
  airport_id         Int       @id @default(autoincrement())
  name               String
  address            String
  airport_code       String
  image_url          String
  file_id            String    @unique
  times_visited      Int       @default(0)
  continent_id       Int
  continent          Continent @relation(fields: [continent_id], references: [continent_id])
  origin_planes      Plane[]   @relation("OriginAirport")
  destination_planes Plane[]   @relation("DestinationAirport")
}
```

#### Continent
```prisma
model Continent {
  continent_id Int       @id @default(autoincrement())
  name         String
  airports     Airport[]
}
```

### Payment Model
```prisma
model Payment {
  id              Int      @id @default(autoincrement())
  orderId         String   @unique
  status          String
  transactionId   String?
  amount          Float
  snapToken       String?
  customerName    String
  customerEmail   String
  customerPhone   String
  customerAddress String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Entity Relationships

1. **User Relationships**
   - One User can have many Notifications
   - One User can have many Transactions

2. **Transaction Relationships**
   - One Transaction belongs to one User
   - One Transaction can have many Tickets

3. **Ticket Relationships**
   - Each Ticket belongs to one Transaction
   - Each Ticket is associated with one Passenger
   - Each Ticket is associated with one Seat
   - Each Ticket is associated with one Plane

4. **Plane Relationships**
   - Each Plane belongs to one Airline
   - Each Plane has one Origin Airport
   - Each Plane has one Destination Airport
   - Each Plane can have multiple Seats
   - Each Plane can have multiple Tickets

5. **Airport Relationships**
   - Each Airport belongs to one Continent
   - Each Airport can be the origin for multiple Planes
   - Each Airport can be the destination for multiple Planes

### Database Migration

To apply this schema:

1. Ensure your PostgreSQL database is running
2. Update your `.env` file with the database connection URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/Quickfly?schema=public"
```

3. Run Prisma migrations:
```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migration
npx prisma migrate deploy
```

4. Generate Prisma Client:
```bash
npx prisma generate
```
