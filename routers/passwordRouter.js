const express = require('express');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

// Password reset routes
router.post('/password/forgot-password', passwordController.forgotPassword);
router.post('/password/reset-password', passwordController.resetPassword);
router.post('/password/confirm-email', passwordController.confirmEmail);

module.exports = router;