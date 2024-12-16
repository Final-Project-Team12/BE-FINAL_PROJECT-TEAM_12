const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const restrictJwt = require('../middlewares/restrictJwt');

router.post('/payments', PaymentController.createPaymentController);
router.post('/payments/:orderId/cancel', PaymentController.cancelPaymentController);
router.get('/payments/:orderId/status', PaymentController.getPaymentStatus);

router.use(restrictJwt);

module.exports = router;
