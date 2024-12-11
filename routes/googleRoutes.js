const express = require('express');
const GoogleController = require('../controllers/googleController');
const router = express.Router();

// Rute untuk memulai login dengan Google
router.get('/google', GoogleController.googleLogin);

// Rute callback setelah login Google
router.get('/google/callback', GoogleController.googleCallback);

module.exports = router;
