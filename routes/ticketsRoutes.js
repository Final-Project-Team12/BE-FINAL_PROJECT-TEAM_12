const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.post('/', ticketsController.createTicket);
router.put('/:ticket_id', ticketsController.updateTicket);
router.delete('/:ticket_id', ticketsController.deleteTicket);

module.exports = router;