# Flight Booking System Documentation
## Table of Contents
- [Backend Team](#Backend-team)
- [Project Overview](#project-overview)
- [Project Setup](#project-setup)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
  - [Overview](#overview)
  - [Authentication](#authentication)
  - [Base URL](#base-url)
  - [API Endpoints](#api-endpoints)


## Project Overview

Our Flight Booking System is a comprehensive solution that enables users to:
- Search and book flights
- Manage bookings
- Process payments
- Receive notifications
- Manage user profiles



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

## Table of Contents
- [Team Overview](#team-overview)
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Setup](#project-setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

### Key Features

#### User Management
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
- Booking modification

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
