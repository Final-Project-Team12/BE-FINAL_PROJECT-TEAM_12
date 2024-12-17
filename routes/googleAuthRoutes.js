const express = require('express');
const GoogleAuthController = require('../controllers/googleAuthController');

const router = express.Router();

router.get('/google', GoogleAuthController.googleLogin);
router.get('/google/callback', GoogleAuthController.googleCallback);
router.put('/google/password/', GoogleAuthController.updatePassword);

module.exports = router;
