const express = require('express');
const GoogleAuthController = require('../controllers/googleAuthController');

const router = express.Router();

router.get('auth/google', GoogleAuthController.googleLogin);
router.get('auth/google/callback', GoogleAuthController.googleCallback);
router.put('auth/google/password/', GoogleAuthController.updatePassword);

module.exports = router;
