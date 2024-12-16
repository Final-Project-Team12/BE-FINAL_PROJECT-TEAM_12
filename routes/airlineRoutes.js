const path = require('path');
const express = require('express');
const router = require('express').Router();
const AirlineController = require('../controllers/airlineController');
const multerUpload = require('../libs/multerUpload');
const restrictJwt = require('../middlewares/restrictJwt')

router.get('/airline/get-airlines', AirlineController.getAirlines);
router.get('/airline/:airline_id', AirlineController.getAirlineById);

const restrictedRoutes = express.Router();

restrictedRoutes.post('/upload-airline-image', multerUpload.single('image'), AirlineController.uploadImageAirlines);
restrictedRoutes.delete('/:airline_id', AirlineController.deleteAirline);
restrictedRoutes.put('/:airline_id', multerUpload.single('image'), AirlineController.updateAirline);

router.use('/airline', restrictJwt, restrictedRoutes);

module.exports = router;
