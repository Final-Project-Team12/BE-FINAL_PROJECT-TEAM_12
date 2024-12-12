const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

router.post('/payments', PaymentController.createPaymentController);
router.post('/payments/:orderId/cancel', PaymentController.cancelPaymentController);
router.get('/payments/:orderId/status', PaymentController.getPaymentStatus);

module.exports = router;