const express = require('express');
const GoogleController = require('../controllers/googleController');
const router = express.Router();

router.get('/google', GoogleController.googleLogin);

router.get('/google/callback', GoogleController.googleCallback);

module.exports = router;
