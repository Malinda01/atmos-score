const express = require("express");
const {
  getWeatherData,
  getCacheStatus,
} = require("../controllers/weather.controller");
const router = express.Router();
const checkJwt = require("../middleware/auth");

// Debug route
router.get("/status", getCacheStatus);

// forecast weather endpoint
router.get("/forecastWeather", checkJwt, getWeatherData);

module.exports = router;
