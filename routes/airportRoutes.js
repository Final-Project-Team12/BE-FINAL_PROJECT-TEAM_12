const express = require('express');
const multer = require('multer');
const AirportController = require('../controllers/airportController');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), AirportController.uploadImageAirport);
router.get('/', AirportController.getAirports);
router.get('/:airport_id', AirportController.getAirportById);
router.delete('/:airport_id', AirportController.deleteAirport);
router.put('/:airport_id', upload.single('image'), AirportController.updateAirport);

module.exports = router;
