const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const cities = require("./cities.json"); // Importing your local file

dotenv.config();
console.log("DEBUG: Key is ->", process.env.OPENWEATHER_API_KEY); // Add this

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. THE COMFORT INDEX FORMULA (Helper Function) ---
const calculateComfortIndex = (temp, humidity, windSpeed) => {
  // Ideal Conditions: 22°C, 50% Humidity, 0 Wind
  const IDEAL_TEMP = 22;
  const IDEAL_HUM = 50;

  // Weights (How much each factor hurts the score)
  const W_TEMP = 2; // High impact
  const W_HUM = 0.5; // Low impact
  const W_WIND = 2; // High impact

  // Calculate Penalties (Math.abs ensures we punish both hot/cold and dry/humid)
  const tempPenalty = Math.abs(temp - IDEAL_TEMP) * W_TEMP;
  const humidityPenalty = Math.abs(humidity - IDEAL_HUM) * W_HUM;
  const windPenalty = windSpeed * W_WIND;

  // Start at 100 and subtract penalties
  let score = 100 - (tempPenalty + humidityPenalty + windPenalty);

  // Clamp score between 0 and 100
  if (score < 0) return 0;
  if (score > 100) return 100;

  return Math.round(score);
};

// --- 2. THE MAIN ROUTE ---
app.get("/api/weather", async (req, res) => {
  try {
    console.log("Fetching weather data...");

    // Step A: Create an array of Promises (Fetch all cities at once)
    const weatherPromises = cities.List.map(async (city) => {
      try {
        // Call OpenWeatherMap API
        // units=metric gives us Celsius (important for our formula)
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );

        const data = response.data;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const condition = data.weather[0].main; // e.g., "Clouds", "Clear"

        // Step B: Calculate the Score IMMEDIATELY
        const score = calculateComfortIndex(temp, humidity, windSpeed);

        // Step C: Return a clean object for the frontend
        return {
          id: city.CityCode,
          name: city.CityName,
          temp: Math.round(temp), // Clean number
          humidity: humidity,
          windSpeed: windSpeed,
          condition: condition,
          score: score,
          // We don't know the rank yet, we need to sort first
        };
      } catch (err) {
        console.error(`Failed to fetch ${city.CityName}:`, err.message);
        return null; // Return null so we can filter it out later
      }
    });

    // Step D: Wait for ALL requests to finish
    const rawResults = await Promise.all(weatherPromises);

    // Step E: Filter out any failed requests (nulls)
    const validResults = rawResults.filter((item) => item !== null);

    // Step F: Sort by Score (Descending: Highest -> Lowest)
    validResults.sort((a, b) => b.score - a.score);

    // Step G: Assign Rank based on sorted order
    const finalResults = validResults.map((city, index) => ({
      ...city,
      rank: index + 1,
    }));

    // Send the JSON response
    res.json({
      success: true,
      cached: false, // We will update this in Phase 2
      data: finalResults,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
