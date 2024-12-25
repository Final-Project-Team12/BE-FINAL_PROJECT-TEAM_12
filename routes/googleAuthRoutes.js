const express = require('express');
const GoogleAuthController = require('../controllers/googleAuthController');

const router = express.Router();

router.get('/google-login', (req, res) => {
    res.render('login', { title: 'Login dengan Google' }); 
});
router.get('/google-home', (req, res) => {
    res.render('home', { title: 'Home dengan Google' }); 
});
router.get('/auth/google', GoogleAuthController.googleLogin);
router.get('/auth/google/callback', GoogleAuthController.googleCallback);
router.put('/auth/google/password/', GoogleAuthController.updatePassword);

module.exports = router;
