require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

const errorHandler = require('./middlewares/errorHandler');

//routers
const ticketListingRouter = require("./routes/flightsRoutes");
const paginationRouter = require('./routes/paginationRoutes')
const userRouter = require('./routes/userRoutes')
const seatRouter = require('./routes/seatRoutes')
const airlineRouter = require("./routes/airlineRoutes");
const passwordRouter = require("./routes/passwordRoutes");
const paymentRoutes = require('./routes/paymentRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const routers = [
  ticketListingRouter,
  paginationRouter,
  userRouter,
  seatRouter,
  airlineRouter,
  passwordRouter,
  paymentRoutes,
];

routers.forEach(router => app.use('/api/v1', router));

app.use(errorHandler);
//buat nangkep semua error langsung
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
  console.log(`Server running on http://localhost:${PORT}`);
});
