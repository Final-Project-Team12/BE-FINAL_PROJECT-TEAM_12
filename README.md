# Flight Booking API Documentation

## Overview
This is the documentation for the Flight Booking API, which provides endpoints for managing flight bookings, user accounts, transactions, and related functionalities.

## Base URL
```
{{url}}/api/v1
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### User Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/user` | POST | Register new user | No |
| `/user/verify` | POST | Verify user account | No |
| `/user/resend` | POST | Resend OTP | No |
| `/user/login` | POST | User login | No |
| `/user/:id` | PUT | Update user profile | Yes |
| `/user/:id` | GET | Get user details | Yes |
| `/user/:id` | DELETE | Delete user account | Yes |

### Password Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/password/forgot-password` | POST | Request password reset | No |
| `/password/confirm-otp` | POST | Confirm OTP for password reset | No |
| `/password/reset-password` | POST | Reset password | No |

### Flights

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/flights` | GET | Get all flights | No |
| `/flights/search` | GET | Search flights with filters | No |

#### Search Parameters
- `from`: Departure airport code
- `to`: Arrival airport code
- `departureDate`: Date of departure
- `returnDate`: Date of return (optional)
- `seatClass`: Class of seat (Economy, Business, etc.)
- `passengerAdult`: Number of adult passengers
- `passengerChild`: Number of child passengers
- `passengerInfant`: Number of infant passengers
- `facilities`: Filter by facilities
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `priceSort`: Sort by price (Cheapest/Expensive)
- `departureSort`: Sort by departure time (First/Last)
- `arrivalSort`: Sort by arrival time (First/Last)
- `durationSort`: Sort by duration (Shortest/Longest)

### Transactions

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/transaction` | POST | Create new transaction | Yes |
| `/transaction/user/:id` | GET | Get user's transactions | Yes |

### Payments

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/payments` | POST | Create payment | Yes |
| `/payments/:orderId/status` | GET | Check payment status | Yes |
| `/payments/:orderId/cancel` | POST | Cancel payment | Yes |

### Tickets

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/ticket` | POST | Create ticket | Yes |

### Notifications

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/notifications` | GET | Get all notifications | Yes |
| `/notifications/:id` | GET | Get specific notification | Yes |
| `/notifications/user/:id` | GET | Get user's notifications | Yes |
| `/notifications` | POST | Create notification | Yes |
| `/notifications/:id` | DELETE | Delete notification | Yes |

### OAuth

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/auth/google` | GET | Google OAuth login | No |
| `/auth/google/password` | PUT | Set password after OAuth | No |

### Admin Only Endpoints

#### Airport Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/airport` | GET | Get all airports | Yes (Admin) |
| `/airport/:id` | GET | Get airport by ID | Yes (Admin) |
| `/airport` | POST | Create new airport | Yes (Admin) |
| `/airport/:id` | PUT | Update airport | Yes (Admin) |
| `/airport/:id` | DELETE | Delete airport | Yes (Admin) |

#### Airline Management

| Endpoint | Method | Description | Authentication Required |
|----------|---------|-------------|----------------------|
| `/airline` | GET | Get all airlines | Yes (Admin) |
| `/airline/:id` | GET | Get airline by ID | Yes (Admin) |
| `/airline` | POST | Create new airline | Yes (Admin) |
| `/airline/:id` | PUT | Update airline | Yes (Admin) |
| `/airline/:id` | DELETE | Delete airline | Yes (Admin) |

## Response Format
All responses follow this general format:
```json
{
    "status": 200,
    "message": "Success message",
    "data": {
        // Response data
    }
}
```

## Error Handling
Errors are returned in this format:
```json
{
    "status": 400,
    "message": "Error message",
    "error": {
        // Error details
    }
}
```

## Rate Limiting
Please be mindful of rate limiting and implement appropriate caching strategies in your applications.

## Support
For any queries or support, please contact the development team.
