const express = require("express");
const {
  getWeatherData,
  getCacheStatus,
} = require("../controllers/weather.controller");
const router = express.Router();
const checkJwt = require("../middleware/auth");

router.get("/status", getCacheStatus);

// ONLY keep the protected route
router.get("/", checkJwt, getWeatherData);

module.exports = router;
