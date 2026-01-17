const express = require("express");
const {
  getWeatherData,
  getCacheStatus,
} = require("../controllers/weather.controller");

const router = express.Router();

router.get("/", getWeatherData);
router.get("/status", getCacheStatus); // New Debug Route

module.exports = router;
