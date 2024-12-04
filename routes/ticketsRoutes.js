const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.post('/ticket', ticketsController.createTicket);
router.put('/ticket/:ticket_id', ticketsController.updateTicket);
router.delete('/ticket/:ticket_id', ticketsController.deleteTicket);

module.exports = router;