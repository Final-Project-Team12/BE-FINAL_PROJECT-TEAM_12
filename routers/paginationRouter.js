const express = require('express');
const router = express.Router();
const PaginationController = require('../controllers/paginationController');

router.get('/tickets', async (req, res, next) => {PaginationController.getPaginationTickets(req, res, next)})

module.exports = router;