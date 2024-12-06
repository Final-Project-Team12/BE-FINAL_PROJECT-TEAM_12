const express = require('express');
const multer = require('multer');
const AirportController = require('../controllers/airportController');
const router = express.Router();
const multerUpload = require('../libs/multerUpload');

router.post('/airport/upload', multerUpload.single('image'), AirportController.uploadImageAirport);
router.get('/airport', AirportController.getAirports);
router.get('/:airport_id', AirportController.getAirportById);
router.delete('/:airport_id', AirportController.deleteAirport);
router.put('/:airport_id', multerUpload.single('image'), AirportController.updateAirport);

module.exports = router;
