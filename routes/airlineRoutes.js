const path = require('path');
const express = require('express');
const router = require('express').Router();
const AirlineController = require('../controllers/airlineController');
const multerUpload = require('../libs/multerUpload');
const restrictJwt = require('../middlewares/restrictJwt')

router.get('/airline/get-airlines', AirlineController.getAirlines);
router.get('/airline/:airline_id', AirlineController.getAirlineById);

const restrictedRoutes = express.Router();

restrictedRoutes.post('/airline/upload-airline-image', multerUpload.single('image'), AirlineController.uploadImageAirlines);
restrictedRoutes.delete('/airline/:airline_id', AirlineController.deleteAirline);
restrictedRoutes.put('/airline/:airline_id', multerUpload.single('image'), AirlineController.updateAirline);

router.use(restrictJwt, restrictedRoutes);

module.exports = router;
