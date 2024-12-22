# 🛫 Flight Booking System Backend
<div align="center">

![Flight Booking System](https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&duration=3000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=Flight+Booking+System;Backend+Development;Team+12+Project)

[![GitHub Stars](https://img.shields.io/github/stars/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12?style=social)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12?style=social)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/pulls)
[![GitHub License](https://img.shields.io/github/license/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12)](https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12/blob/main/LICENSE)

</div>

## 👥 Our Amazing Team

<div align="center">

| <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Zefanya+Diego+Forlandicco" alt="Zefanya Diego Forlandicco" /> | <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Wahyu+Pinanda+Ginting" alt="Wahyu Pinanda Ginting" /> | <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Cornellius+Barros+Kangga" alt="Cornellius Barros Kangga" /> | <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1000&pause=100&color=FF7F50&center=true&vCenter=true&repeat=false&width=435&lines=Alif+Naufal+Taufiqi" alt="Alif Naufal Taufiqi" /> |
|:---:|:---:|:---:|:---:|
| Backend Developer | Backend Developer | Backend Developer | Backend Developer |

</div>

## 🌟 Key Features

<div align="center">

![Features Animation](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=User+Management;Flight+Search;Secure+Payments;Real-time+Notifications)

</div>

- 🔐 **User Management**
  - Email-based authentication
  - Google OAuth integration
  - JWT token-based sessions
  - Password recovery system
  - OTP verification

- ✈️ **Flight Management**
  - Advanced flight search
  - Multi-city routing
  - Fare comparison
  - Seat selection
  - Real-time availability

- 💳 **Booking System**
  - Secure payment processing
  - Multiple payment methods
  - Booking confirmation
  - E-ticket generation

## 🛠️ Technology Stack

<div align="center">

![Tech Stack](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=Node.js;Express.js;PostgreSQL;Sequelize+ORM;JWT;Midtrans)

</div>

- **Backend Framework**: Node.js + Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT + OAuth
- **Cloud**: AWS EC2
- **Email**: Nodemailer
- **Payments**: Midtrans Gateway

## 🚀 Getting Started

### Prerequisites

```bash
node -v
# v14.x or higher
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Final-Project-Team12/BE-FINAL_PROJECT-TEAM_12
```

2. Navigate to project directory:
```bash
cd BE-FINAL_PROJECT-TEAM_12
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file:
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

## 📚 API Documentation

<div align="center">

![API Documentation](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=RESTful+API;Comprehensive+Endpoints;Secure+Authentication;Clear+Documentation)

</div>

### Base URL
```
{{url}}/api/v1
```

### Authentication
```http
Authorization: Bearer <your_token>
```

[View Complete API Documentation](./API.md)

## 📊 Database Schema

<div align="center">

![Database Schema](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=38F77CFF&center=true&vCenter=true&width=435&lines=PostgreSQL;Prisma+ORM;Efficient+Design;Scalable+Structure)

</div>

[View Complete Database Schema](./SCHEMA.md)

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
