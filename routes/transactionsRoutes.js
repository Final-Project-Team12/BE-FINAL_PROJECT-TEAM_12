const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.get('/', transactionsController.getAllTransactions);
router.post('/', transactionsController.createTransaction);
router.put('/:transaction_id', transactionsController.updateTransaction);
router.delete('/:transaction_id', transactionsController.deleteTransaction);

module.exports = router;