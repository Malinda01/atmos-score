import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

export const useWeather = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0(); // Get Auth0 tools
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!isAuthenticated) return; // Don't fetch if not logged in

    try {
      setLoading(true);
      setError(null);
      // Ensure your server is running on port 5000
      const response = await axios.get("http://localhost:5000/api/weather", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // --- CHANGE START ---
      if (response.data.success) {
        setWeatherData(response.data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        // Catch silent backend errors (e.g. 500 Internal Server Error returned as JSON)
        console.error("Backend Error:", response.data.message);
        setError(
          response.data.message || "Server returned unsuccessful response",
        );
      }
      // --- CHANGE END ---
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
