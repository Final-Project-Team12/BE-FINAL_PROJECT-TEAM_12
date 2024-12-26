const express = require('express');
const router = express.Router();
const SeatController = require('../controllers/seatController');

router.post('/seats', SeatController.createSeat);
router.get('/seats', SeatController.getAllSeats);
router.get('/seats/:seat_id', SeatController.getSeatById);
router.put('/seats/:seat_id', SeatController.updateSeat);
router.delete('/seats/:seat_id', SeatController.deleteSeat);

module.exports = router;
