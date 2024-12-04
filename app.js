const express = require('express');
const transactionRoutes = require('./routes/transactionsRoutes');
const ticketRoutes = require('./routes/ticketsRoutes');

const app = express();

app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
module.exports = app;