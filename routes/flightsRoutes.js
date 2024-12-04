const express = require("express");
const FlightsController = require("../controllers/flightsController");

const router = express.Router();

router.get("/flights", FlightsController.getFilteredFlights);

module.exports = router;
