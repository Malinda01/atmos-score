const { fetchWeatherForCities } = require("../services/weather.service");
const cache = require("../utils/cache"); // Import for stats

const getWeatherData = async (req, res) => {
  try {
    // Service returns { data, fromCache }
    const { data, fromCache } = await fetchWeatherForCities();

    res.json({
      success: true,
      cached: fromCache, // true = HIT, false = miss
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCacheStatus = (req, res) => {
  res.json({
    status: "Active",
    stats: cache.getStats(), // Global hits or miss counts
    keys: cache.keys(), // Lists what is currently in memory
  });
};

module.exports = { getWeatherData, getCacheStatus };
