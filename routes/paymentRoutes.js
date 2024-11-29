const express = require('express');
const { createPaymentController, handleNotificationController } = require('../controllers/paymentController');

const router = express.Router();

router.post('/payments', createPaymentController);
router.post('/payments/notification', handleNotificationController);

module.exports = router;
