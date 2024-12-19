const express = require('express');
const router = express.Router();
const PaginationController = require('../controllers/paginationController');

const restrictJwt = require('../middlewares/restrictJwt')

const restrictedRoutes = express.Router();

restrictedRoutes.get('', async (req, res, next) => {PaginationController.getPaginationTickets(req, res, next)})

router.use('/tickets', restrictJwt, restrictedRoutes);

module.exports = router;