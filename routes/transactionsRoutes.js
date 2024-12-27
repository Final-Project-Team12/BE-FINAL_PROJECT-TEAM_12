const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

const restrictJwt = require('../middlewares/restrictJwt')
const restrictJwtAdmin = require('../middlewares/restrictJwtAdmin')

const restrictedRoutes = express.Router();

restrictedRoutes.get('/user/:user_id', transactionsController.getTransactionsByUserId);
restrictedRoutes.post('', transactionsController.createTransaction);

router.use('/transaction', restrictJwt, restrictedRoutes);

const restrictedRoutesAdmin = express.Router();

restrictedRoutesAdmin.put('/:transaction_id', transactionsController.updateTransaction);
restrictedRoutesAdmin.delete('/:transaction_id', transactionsController.deleteTransaction)

router.use('/transaction', restrictJwtAdmin, restrictedRoutesAdmin);

module.exports = router;