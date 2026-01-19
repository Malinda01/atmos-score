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

  // 1. Loading Auth0 status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 2. Not Logged In -> Show Landing Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 transition-colors">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-5xl font-extrabold bg-`gradient`-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Atmos Score
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Please log in to view the weather analytics dashboard.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  // 3. Logged In -> Show Dashboard
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
