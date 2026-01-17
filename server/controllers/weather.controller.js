const { fetchWeatherForCities } = require("../services/weather.service");

const getWeatherData = async (req, res) => {
  try {
    const results = await fetchWeatherForCities();
    res.json({
      success: true,
      cached: false,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getWeatherData };
