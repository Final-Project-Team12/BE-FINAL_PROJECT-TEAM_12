# 🛫 Flight Booking System Backend
<div align="center">

![Flight Booking System](https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&duration=3000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=Flight+Booking+System;Backend+Development;Team+12+Project)

[![GitHub Stars](https://img.shields.io/github/stars/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12?style=social)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12?style=social)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/pulls)
[![GitHub License](https://img.shields.io/github/license/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/blob/main/LICENSE)

</div>

## 📚 Table of Contents
- [Our Team](#-our-amazing-team)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Project Management](#-project-management)
- [Contributing](#-contributing)
- [License](#-license)

## 👥 Our Amazing Team

<div align="center">

| <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=25&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Zefanya+Diego+Forlandicco" alt="Zefanya Diego Forlandicco" /> | <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=25&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Wahyu+Pinanda+Ginting" alt="Wahyu Pinanda Ginting" /> | <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=25&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Cornellius+Barros+Kangga" alt="Cornellius Barros Kangga" /> | <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=25&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Alif+Naufal+Taufiqi" alt="Alif Naufal Taufiqi" /> |
|:---:|:---:|:---:|:---:|
| Backend Developer | Backend Developer | Backend Developer | Backend Developer |

</div>

## 📚 API Documentation

<div align="center">

![API Documentation](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=RESTful+API;Comprehensive+Endpoints;Secure+Authentication;Clear+Documentation)

</div>

### Base URL
```
{{url}}/api/v1
```

### Authentication
All authenticated endpoints require a Bearer token:
```http
Authorization: Bearer <your_token>
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
## 📊 Database Schema

<div align="center">

![Database Schema](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=PostgreSQL;Prisma+ORM;Efficient+Design;Scalable+Structure)

</div>

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


## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- users.test.js

# Run with coverage report
npm run test:coverage
```

## 📝 Project Management

<div align="center">

[![ClickUp Tasks](https://img.shields.io/badge/ClickUp-Tasks-7B68EE)](https://app.clickup.com/9018681465/v/b/8crwa3t-458)

</div>

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">

![Thanks for visiting!](https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=Thanks+for+visiting!;Star+if+you+like+it!+⭐)

</div>
