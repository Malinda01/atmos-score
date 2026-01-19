import { LogoutButton } from "./AuthButtons";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../context/ThemeContext";

const Header = ({ lastUpdated, onRefresh, loading }) => {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth0();

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Atmos Score Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Weather Analytics & Comfort Index
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-4">
        {/* --- NEW: User Profile Section --- */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-gray-700">
            <img
              src={user.picture}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-blue-100 dark:border-gray-600"
            />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight">
                {user.nickname || user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        )}
        {/* -------------------------------- */}
        {/* Dark mode begin */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {/* Dark mode end */}
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            Last updated: {lastUpdated}
          </span>
        )}
        <LogoutButton /> {/* <--- Add this here */}
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>
    </header>
  );
};

export default Header;
