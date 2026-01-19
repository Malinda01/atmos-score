import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Requirement: Fetch weather data [cite: 6, 41]
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      // Ensure your server is running on port 5000
      const response = await axios.get("http://localhost:5000/api/weather");

      if (response.data.success) {
        setWeatherData(response.data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError("Failed to load weather data");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Error connecting to server. Ensure backend is running on port 5000.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Optional: Auto-refresh every 5 minutes to match cache TTL [cite: 67]
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  // Helper to color-code the Comfort Score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-md">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Atmos Score Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Weather Analytics & Comfort Index
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Last updated: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchWeather}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !weatherData.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Requirement: Responsive UI (Grid Layout supports mobile + desktop)  */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Requirement: Display Rank, City, Weather, Temp, Score [cite: 60-65] */}
            {weatherData.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 relative"
              >
                {/* Ranking Badge */}
                <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
                  Rank #{city.rank}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold truncate">
                        {city.name}
                      </h2>
                      <p className="text-sm text-gray-500 capitalize">
                        {city.condition}
                      </p>
                    </div>
                    <div className="text-3xl font-light">{city.temp}°C</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Humidity</span>
                      <span className="font-medium">{city.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Wind Speed</span>
                      <span className="font-medium">{city.windSpeed} m/s</span>
                    </div>

                    <div className="my-4 border-t border-gray-200"></div>

                    {/* Comfort Score Section */}
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Comfort Score
                      </span>
                      <span
                        className={`text-4xl font-bold ${getScoreColor(city.score)}`}
                      >
                        {city.score}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar Visual */}
                <div className="h-1.5 w-full bg-gray-200 mt-auto">
                  <div
                    className={`h-full ${city.score >= 80 ? "bg-green-500" : city.score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${city.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
