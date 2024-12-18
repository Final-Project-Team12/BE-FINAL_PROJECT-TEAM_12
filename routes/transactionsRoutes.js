const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

const restrictJwt = require('../middlewares/restrictJwt')

const restrictedRoutes = express.Router();

restrictedRoutes.get('/user/:user_id', transactionsController.getTransactionsByUserId);
restrictedRoutes.post('', transactionsController.createTransaction);
restrictedRoutes.put('/:transaction_id', transactionsController.updateTransaction);
restrictedRoutes.delete('/:transaction_id', transactionsController.deleteTransaction)

router.use('/transaction', restrictJwt, restrictedRoutes);

module.exports = router;