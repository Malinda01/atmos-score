import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchWeather();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { weatherData, loading, error, lastUpdated, fetchWeather };
};
