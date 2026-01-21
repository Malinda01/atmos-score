import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useWeather = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async () => {
    // 1. If not logged in, stop immediately.
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // 2. GET THE TOKEN (This was missing!)
      const token = await getAccessTokenSilently();

      // 3. SEND THE TOKEN IN THE HEADER
      const response = await axios.get(
        "http://localhost:5000/api/weather/forecastWeather",
        {
          headers: {
            Authorization: `Bearer ${token}`, // <--- The "Key"
          },
        },
      );

      if (response.data.success) {
        setWeatherData(response.data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError("Failed to load weather data");
      }
    } catch (err) {
      console.error(err);
      // specific error message if auth fails
      if (err.error === "login_required") {
        setError("Please log in again.");
      } else {
        setError("Error connecting to server.");
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather();
    }
    const interval = setInterval(() => {
      if (isAuthenticated) fetchWeather();
    }, 300000);
    return () => clearInterval(interval);
  }, [fetchWeather, isAuthenticated]);

  return { weatherData, loading, error, lastUpdated, fetchWeather };
};
