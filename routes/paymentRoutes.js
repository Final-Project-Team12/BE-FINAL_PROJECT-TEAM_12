const express = require('express');
const { createPaymentController, handleNotificationController,cancelPaymentController, } = require('../controllers/paymentController');

const router = express.Router();

router.post('/payments', createPaymentController);
router.post('/payments/notification', handleNotificationController);
router.post('/payments/cancel/:orderId', cancelPaymentController);

module.exports = router;
