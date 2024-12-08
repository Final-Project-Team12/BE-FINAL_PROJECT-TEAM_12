const express = require("express");
const FlightsController = require("../controllers/FlightsController");
const router = express.Router();

// Endpoint untuk /flights
router.get("/flights", FlightsController.getFlights);

// Endpoint untuk /flights/search
router.get("/flights/search", FlightsController.searchFilteredFlights);

module.exports = router;
