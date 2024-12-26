const express = require('express');
const router = express.Router();
const PlaneController = require('../controllers/planeController');
const restrictJwtAdmin = require('../middlewares/restrictJwtAdmin');

router.get('/planes', PlaneController.getAllPlanesController);
router.get('/planes/:plane_id', PlaneController.getPlaneByIdController);

const restrictedPlaneRoutes = express.Router();
restrictedPlaneRoutes.post('/', PlaneController.createPlaneController);
restrictedPlaneRoutes.put('/:plane_id', PlaneController.updatePlaneController);
restrictedPlaneRoutes.delete('/:plane_id', PlaneController.deletePlaneController);
router.use('/planes', restrictJwtAdmin, restrictedPlaneRoutes);

module.exports = router;
