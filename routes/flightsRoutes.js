const express = require("express");
const TicketListingController = require("../controllers/flightsController");

const router = express.Router();

router.get("/flights", TicketListingController.getFilteredFlights);

module.exports = router;
