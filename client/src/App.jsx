import { useAuth0 } from "@auth0/auth0-react";
import { useWeather } from "./hooks/useWeather";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import WeatherCard from "./components/WeatherCard";
import { LoginButton } from "./components/AuthButtons";
import { LoadingSpinner, ErrorMessage } from "./components/States";
import "./App.css";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { weatherData, loading, error, lastUpdated, fetchWeather } =
    useWeather();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Atmos Score
          </h1>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Header
          lastUpdated={lastUpdated}
          loading={loading}
          onRefresh={fetchWeather}
        />
        {error && <ErrorMessage message={error} />}
        {loading ? (
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
