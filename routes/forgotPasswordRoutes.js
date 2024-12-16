const express = require('express');
const ForgotPasswordController = require('../controllers/forgotPasswordController');
const router = express.Router();

router.post('/password/forgot-password', ForgotPasswordController.forgotPassword);
router.post('/password/confirm-otp', ForgotPasswordController.confirmOtp);
router.post('/password/reset-password', ForgotPasswordController.resetPassword);

module.exports = router;
