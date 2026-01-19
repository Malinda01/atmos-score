import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useWeather = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false); // Start false, wait for auth
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Get Token
      const token = await getAccessTokenSilently();

      // 2. Send Token
      const response = await axios.get("http://localhost:5000/api/weather", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setWeatherData(response.data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data. Ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Trigger fetch when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather();
    }
  }, [isAuthenticated, fetchWeather]);

  return { weatherData, loading, error, lastUpdated, fetchWeather };
};
