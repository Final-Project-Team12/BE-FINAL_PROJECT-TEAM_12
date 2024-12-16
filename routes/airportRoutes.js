const express = require('express');
const multer = require('multer');
const AirportController = require('../controllers/airportController');
const router = express.Router();
const multerUpload = require('../libs/multerUpload');
const restrictJwt = require('../middlewares/restrictJwt')

router.get('/airport', AirportController.getAirports);
router.get('/airport/:airport_id', AirportController.getAirportById);

const restrictedRoutes = express.Router();

router.post('/airport/upload', multerUpload.single('image'), AirportController.uploadImageAirport);
router.delete('/:airport_id', AirportController.deleteAirport);
router.put('/:airport_id', multerUpload.single('image'), AirportController.updateAirport);

router.use('/airport', restrictJwt, restrictedRoutes);

module.exports = router;
