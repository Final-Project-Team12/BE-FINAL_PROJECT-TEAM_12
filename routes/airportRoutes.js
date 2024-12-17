const express = require('express');
const AirportController = require('../controllers/airportController');
const multerUpload = require('../libs/multerUpload');
const restrictJwt = require('../middlewares/restrictJwt');

const router = express.Router();

router.get('/airport', AirportController.getAirports);
router.get('/airport/:airport_id', AirportController.getAirportById);

const restrictedRoutes = express.Router();

restrictedRoutes.post('/', multerUpload.single('image'), AirportController.createAirport);
restrictedRoutes.delete('/:airport_id', AirportController.deleteAirport);
restrictedRoutes.put('/:airport_id', multerUpload.single('image'), AirportController.updateAirport);

router.use('/airport', restrictJwt, restrictedRoutes);

module.exports = router;
