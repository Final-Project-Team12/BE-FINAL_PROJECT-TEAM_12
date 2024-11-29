# Midtrans Payment Integration

A Node.js project integrating Midtrans API for handling payments using bank transfer. This application utilizes Express.js for routing, Prisma for database management, and Axios for HTTP requests.

---

## Features
- **Payment Initialization**: Create payment requests and retrieve virtual account details.
- **Notification Handling**: Process asynchronous payment notifications from Midtrans.
- **Validation**: Input validations for secure and robust payment requests.
- **Database Integration**: Tracks payment details using Prisma ORM with PostgreSQL.

---

## Prerequisites
Ensure you have the following installed:
- Node.js (>=14.x)
- PostgreSQL
- Midtrans Account (Sandbox Mode for testing)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/midtrans-integration.git
cd midtrans-integration
```

### 2. Install Dependencies
```
npm install
```

### 3. Setup Environment Variables
Create a .env file and configure the following:
```
MIDTRANS_SERVER_KEY=your-midtrans-server-key
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```
### 4. Run Database Migration
```
npx prisma migrate dev
```
## Usage
1. Start the Server
```
npm start
```
## 2. API Endpoints

### 1. Create Payment
Initiates a payment request to Midtrans.

- **Endpoint**: `POST /api/payments`
- **Headers**:
  - `Content-Type`: `application/json`
- **Request Body**:
  ```json
  {
    "orderId": "order_12345",
    "amount": 100000
  }
  ```
- Response
```
{
  "message": "Payment initiated successfully",
  "data": {
    "status_code": "201",
    "status_message": "Success, Bank Transfer transaction is created",
    "transaction_id": "transaction_id_here",
    "order_id": "order_12345",
    "gross_amount": "100000.00",
    "currency": "IDR",
    "payment_type": "bank_transfer",
    "transaction_time": "timestamp_here",
    "transaction_status": "pending",
    "va_numbers": [
      { "bank": "bca", "va_number": "1234567890" }
    ],
    "expiry_time": "timestamp_here"
  },
  "status": "success"
}
