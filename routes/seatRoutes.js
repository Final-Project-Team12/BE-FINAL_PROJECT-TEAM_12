const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/seatController');

router.get('/seat', TicketController.getSeat)
router.get('/seat/:seat_id', TicketController.getSeatById)

module.exports = router;