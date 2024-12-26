const express = require('express');
const router = express.Router();
const GoogleAuthController = require('../controllers/googleAuthController');

// Endpoint untuk mendapatkan URL login Google
router.get('/google-login', (req, res) => {
    res.render('login', { title: 'Login dengan Google' }); 
});
router.get('/google/initiate', GoogleAuthController.initiateGoogleLogin);

// Endpoint untuk menyelesaikan login Google
router.post('/google/login', GoogleAuthController.completeGoogleLogin);

module.exports = router;
