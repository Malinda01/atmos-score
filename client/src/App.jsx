import "./App.css";
import { useWeather } from "./hooks/useWeather";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import WeatherCard from "./components/WeatherCard";
import { LoadingSpinner, ErrorMessage } from "./components/States";

function AppContent() {
  const { weatherData, loading, error, lastUpdated, fetchWeather } =
    useWeather();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Header
          lastUpdated={lastUpdated}
          loading={loading}
          onRefresh={fetchWeather}
        />

        {error && <ErrorMessage message={error} />}

        {loading && !weatherData.length ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weatherData.map((city) => (
              <WeatherCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
