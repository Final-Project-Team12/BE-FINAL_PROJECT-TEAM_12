const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/seatController');

router.get('/seat', async (req, res, next) => {TicketController.getSeat(req, res, next)})
router.get('/seat/:seat_id', async (req, res, next) => {TicketController.getSeatById(req, res, next, req.params.seat_id)})

module.exports = router;