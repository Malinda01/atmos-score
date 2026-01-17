const express = require("express");
const { getWeatherData } = require("../controllers/weather.controller");

const router = express.Router();

router.get("/", getWeatherData);

module.exports = router;
