const express = require('express');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

router.post('/password/forgot-password', passwordController.forgotPassword);
router.post('/password/confirm-otp', passwordController.confirmOtp);
router.post('/password/reset-password', passwordController.resetPassword);

module.exports = router;
