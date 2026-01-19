const express = require("express");
const {
  getWeatherData,
  getCacheStatus,
} = require("../controllers/weather.controller");

const router = express.Router();
const checkJwt = require("../middleware/auth"); // Import middleware

// router.get("/", getWeatherData);
router.get("/status", getCacheStatus); // New Debug Route
router.get("/", checkJwt, getWeatherData);

module.exports = router;
