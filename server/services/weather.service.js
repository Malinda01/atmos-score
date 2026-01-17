const axios = require("axios");
const cities = require("../data/cities.json");
const calculateComfortIndex = require("../utils/comfortIndex");
const cache = require("../utils/cache"); // Import the singleton

// Helper: Fetch Raw Data (Layer 2 Cache)
const fetchRawData = async (cityCode) => {
  const RAW_KEY = `raw_${cityCode}`;

  // 1. Check Raw Cache
  const cachedRaw = cache.get(RAW_KEY);
  if (cachedRaw) return cachedRaw;

  // 2. If missing, hit API
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    // 3. Save to Raw Cache
    cache.set(RAW_KEY, res.data);
    return res.data;
  } catch (error) {
    console.error(`Error fetching ${cityCode}:`, error.message);
    return null;
  }
};

const fetchWeatherForCities = async () => {
  const DASHBOARD_KEY = "dashboard_processed";

  // --- LAYER 1: Check Processed Dashboard Cache ---
  const cachedDashboard = cache.get(DASHBOARD_KEY);
  if (cachedDashboard) {
    return { data: cachedDashboard, fromCache: true };
  }

  // --- LAYER 2: Process Data (Using Raw Cache internal helper) ---
  const promises = cities.List.map(async (city) => {
    const rawData = await fetchRawData(city.CityCode);

    if (!rawData) return null;

    const { temp, humidity } = rawData.main;
    const windSpeed = rawData.wind.speed;

    return {
      id: city.CityCode,
      name: city.CityName,
      temp: Math.round(temp),
      humidity,
      windSpeed,
      condition: rawData.weather[0].main,
      score: calculateComfortIndex(temp, humidity, windSpeed),
    };
  });

  const results = await Promise.all(promises);
  const validResults = results.filter((r) => r !== null);

  // Sort & Rank
  const finalResults = validResults
    .sort((a, b) => b.score - a.score)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  // Save to Processed Cache
  cache.set(DASHBOARD_KEY, finalResults);

  return { data: finalResults, fromCache: false };
};

module.exports = { fetchWeatherForCities };
