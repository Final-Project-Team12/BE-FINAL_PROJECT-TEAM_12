require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

//routers
const ticketListingRouter = require("./routers/flightsRouter");
const paginationRouter = require('./routers/paginationRouter')
const userRouter = require('./routers/userRouter')
const seatRouter = require('./routers/seatRouter')
const airlineRouter = require("./routers/airlineRouter");
const passwordRouter = require("./routers/passwordRouter");

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
];

routers.forEach(router => app.use('/api/v1', router));

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
