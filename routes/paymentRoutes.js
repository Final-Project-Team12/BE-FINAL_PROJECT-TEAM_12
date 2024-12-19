const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const restrictJwt = require('../middlewares/restrictJwt');

const restrictedRoutes = express.Router();

restrictedRoutes.post('', PaymentController.createPaymentController);
restrictedRoutes.post('/:orderId/cancel', PaymentController.cancelPaymentController);
restrictedRoutes.get('/:orderId/status', PaymentController.getPaymentStatus);

router.use('/payments', restrictJwt, restrictedRoutes);

module.exports = router;
