const axios = require("axios");
const cities = require("../data/cities.json");
const calculateComfortIndex = require("../utils/comfortIndex");
const cache = require("../utils/cache");

// Helper: Fetch Raw Data (Switch to FORECAST endpoint)
const fetchRawData = async (cityCode) => {
  // 1. Change Key to separate forecast cache from old weather cache
  const RAW_KEY = `raw_forecast_${cityCode}`;

  // 2. Check Raw Cache
  const cachedRaw = cache.get(RAW_KEY);
  // If found return cached data
  if (cachedRaw) return cachedRaw;

  // 3. If missing, hit API (Using /forecast instead of /weather)
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?id=${cityCode}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    );
    // 4. Save to Raw Cache
    cache.set(RAW_KEY, res.data);
    return res.data;
  } catch (error) {
    console.error(`Error fetching ${cityCode}:`, error.message);
    return null;
  }
};

const fetchWeatherForCities = async () => {
  // Update dashboard key to force a fresh fetch
  const DASHBOARD_KEY = "dashboard_processed_v2";

  const cachedDashboard = cache.get(DASHBOARD_KEY);
  if (cachedDashboard) {
    return { data: cachedDashboard, fromCache: true };
  }

  const cityCodes = cities.List.map((city) => city.CityCode);

  const promises = cityCodes.map(async (code) => {
    const rawData = await fetchRawData(code);

    if (!rawData) return null;

    const originalCity = cities.List.find((c) => c.CityCode === code);

    // API returns a list of 3-hour forecasts.
    // We use the first item as "Current" and the next 8 items (24 hours) for the graph.
    const current = rawData.list[0];

    // Extract next 24 hours (8 segments x 3 hours) for the graph
    const trend = rawData.list.slice(0, 8).map((item) => {
      const date = new Date(item.dt * 1000);
      return {
        time: `${date.getHours()}:00`, // Format: "14:00"
        temp: Math.round(item.main.temp),
      };
    });

    const { temp, humidity } = current.main;
    const windSpeed = current.wind.speed;

    return {
      id: code,
      name: originalCity ? originalCity.CityName : rawData.city.name, // Note: structure changes to rawData.city.name in forecast API
      temp: Math.round(temp),
      humidity,
      windSpeed,
      condition: current.weather[0].main,
      score: calculateComfortIndex(temp, humidity, windSpeed),
      trend: trend,
    };
  });

  const results = await Promise.all(promises);
  const validResults = results.filter((r) => r !== null);

  // Sort & Rank
  const finalResults = validResults
    .sort((a, b) => b.score - a.score)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  cache.set(DASHBOARD_KEY, finalResults);

  return { data: finalResults, fromCache: false };
};

module.exports = { fetchWeatherForCities };
