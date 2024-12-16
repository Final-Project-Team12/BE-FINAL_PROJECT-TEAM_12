const express = require('express');
const GoogleAuthController = require('../controllers/GoogleAuthController');

const router = express.Router();

router.get('/google', GoogleAuthController.googleLogin);
router.get('/google/callback', GoogleAuthController.googleCallback);
router.put('/google/password/:user_id', GoogleAuthController.updatePassword);

module.exports = router;
