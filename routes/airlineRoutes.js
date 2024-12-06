const path = require('path');
const router = require('express').Router();
const AirlineController = require('../controllers/airlineController');
const multerUpload = require('../libs/multerUpload');


router.post('/airline/upload-airline-image', multerUpload.single('image'), AirlineController.uploadImageAirlines);
router.get('/airline/get-airlines', AirlineController.getAirlines);
router.get('/airline/:airline_id', AirlineController.getAirlineById);
router.delete('/airline/:airline_id', AirlineController.deleteAirline);
router.put('/airline/:airline_id', multerUpload.single('image'), AirlineController.updateAirline);

module.exports = router;
