const Header = ({ lastUpdated, onRefresh, loading }) => {
  return (
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
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
    </header>
  );
};

export default Header;
