const express = require("express");
const {
  getWeatherData,
  getCacheStatus,
} = require("../controllers/weather.controller");
const router = express.Router();
const checkJwt = require("../middleware/auth");

// Debug route
router.get("/status", getCacheStatus);

router.get("/", checkJwt, getWeatherData);

module.exports = router;
