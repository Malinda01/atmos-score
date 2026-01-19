import { useState, useMemo } from "react"; // <--- Import these hooks
import { useAuth0 } from "@auth0/auth0-react";
import { useWeather } from "./hooks/useWeather";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import WeatherCard from "./components/WeatherCard";
import Filters from "./components/Filters"; // <--- Import Filters
import { LoginButton } from "./components/AuthButtons";
import { LoadingSpinner, ErrorMessage } from "./components/States";
import "./App.css";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { weatherData, loading, error, lastUpdated, fetchWeather } =
    useWeather();

  // 1. STATE FOR FILTERS
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // 2. FILTER & SORT LOGIC (Frontend Only)
  const processedData = useMemo(() => {
    if (!weatherData) return [];

    // A. Filter by Name (Search)
    let data = weatherData.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // B. Sort Logic
    data.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "score_desc":
          return b.score - a.score;
        case "score_asc":
          return a.score - b.score;
        case "temp_desc":
          return b.temp - a.temp;
        case "temp_asc":
          return a.temp - b.temp;
        default:
          return 0; // Keep default rank
      }
    });

    return data;
  }, [weatherData, searchQuery, sortBy]);

  // 3. RENDER UI
  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="text-center pt-20">
          <h1 className="fixed top-35 left-0 w-full text-4xl font-bold p-4 text-center bg-white dark:bg-gray-900 dark:text-white z-50">
            Atmos Score
          </h1>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Header
          lastUpdated={lastUpdated}
          loading={loading}
          onRefresh={fetchWeather}
        />

        {/* SHOW FILTERS IF LOGGED IN & NO ERROR */}
        {!loading && !error && (
          <Filters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* EMPTY SEARCH STATE */}
            {!loading &&
              processedData.length === 0 &&
              weatherData.length > 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No cities found matching "{searchQuery}"
                </div>
              )}

            {/* THE GRID (Display processedData) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedData.map((city) => (
                <WeatherCard key={city.id} city={city} />
              ))}
            </div>
          </>
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
