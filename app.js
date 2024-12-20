if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();
const prisma = new PrismaClient();

//middlewares 
const restrictJwt = require('./middlewares/restrictJwt');
const errorHandler = require('./middlewares/errorHandler');

const googleAuthRoutes = require('./routes/googleAuthRoutes');
const ticketListingRoutes = require("./routes/flightsRoutes");
const paginationRoutes = require('./routes/paginationRoutes')
const userRoutes = require('./routes/userRoutes');
const seatRoutes = require('./routes/seatRoutes');
const airportRoutes = require('./routes/airportRoutes');
const airlineRoutes = require("./routes/airlineRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const transactionRoutes = require('./routes/transactionsRoutes');
const ticketRoutes = require('./routes/ticketsRoutes');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
const routers = [
  googleAuthRoutes,
  ticketListingRoutes,
  paginationRoutes,
  seatRoutes,
  forgotPasswordRoutes,
  transactionRoutes,
  //gak semuanya kena auth
  userRoutes,
  airportRoutes,
  airlineRoutes,
  //auth semua
  paymentRoutes,
  notificationRoutes,
  ticketRoutes,
];

routers.forEach(router => app.use('/api/v1', router));


app.use(errorHandler);
//buat nangkap error cek ci-cd 14

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message : "Lihat error di console"
  })
})

// Sample query
// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// Start Server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} zefanya tanpa pemanis buatan`);
});