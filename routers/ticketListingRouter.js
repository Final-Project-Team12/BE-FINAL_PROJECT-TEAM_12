const express = require("express");
const TicketListingController = require("../controllers/ticketListingController");

const router = express.Router();

router.get("/ticket-listing", TicketListingController.getFilteredFlights);

module.exports = router;
