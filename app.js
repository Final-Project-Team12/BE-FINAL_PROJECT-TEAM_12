require('dotenv').config();
const cors = require('cors')
const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const paymentRoutes = require('./router/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', paymentRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
