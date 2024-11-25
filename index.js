require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

//routers
const paginationRouter = require('./routers/paginationRouter')

app.use(bodyParser.json());
app.use(cors());

app.use('/pagination' ,paginationRouter);

//buat nangkep semua error langsung
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
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
