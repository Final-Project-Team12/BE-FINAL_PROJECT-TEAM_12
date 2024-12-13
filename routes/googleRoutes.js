const express = require('express');
const GoogleAuthController = require('../controllers/googleAuthController');
const router = express.Router();

router.get('/google', GoogleAuthController.googleLogin);

router.get('/google/callback', GoogleAuthController.googleCallback);

module.exports = router;
