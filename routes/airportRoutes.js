const express = require('express');
const router = express.Router();
const AirportController = require('../controllers/airportController');
const multerUpload = require('../libs/multerUpload');
const restrictJwtAdmin = require('../middlewares/restrictJwtAdmin')

router.get('/airport', AirportController.getAirports);
router.get('/airport/:airport_id', AirportController.getAirportById);

const restrictedRoutes = express.Router();

restrictedRoutes.post('/', multerUpload.single('image'), AirportController.createAirport);
restrictedRoutes.delete('/:airport_id', AirportController.deleteAirport);
restrictedRoutes.put('/:airport_id', multerUpload.single('image'), AirportController.updateAirport);

router.use('/airport', restrictJwtAdmin, restrictedRoutes);

module.exports = router;
