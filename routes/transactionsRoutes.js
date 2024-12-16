const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.get('/transaction/user/:user_id', transactionsController.getTransactionsByUserId);
router.post('/transaction', transactionsController.createTransaction);
router.put('/transaction/:transaction_id', transactionsController.updateTransaction);
router.delete('/transaction/:transaction_id', transactionsController.deleteTransaction)

module.exports = router;