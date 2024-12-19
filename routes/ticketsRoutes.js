const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

const restrictJwt = require('../middlewares/restrictJwt');

const restrictedRoutes = express.Router();

restrictedRoutes.post('', ticketsController.createTicket);
restrictedRoutes.put('/:ticket_id', ticketsController.updateTicket);
restrictedRoutes.delete('/:ticket_id', ticketsController.deleteTicket);

router.use('/ticket', restrictJwt, restrictedRoutes);

module.exports = router;