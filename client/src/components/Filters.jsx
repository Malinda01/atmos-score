import React from "react";

const Filters = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Search Input */}
      <div className="relative w-full sm:w-1/2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-48 p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="default">Default (Rank)</option>
          <option value="name">Name (A-Z)</option>
          <option value="score_desc">Comfort Score (High to Low)</option>
          <option value="score_asc">Comfort Score (Low to High)</option>
          <option value="temp_desc">Temperature (Hot First)</option>
          <option value="temp_asc">Temperature (Cold First)</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
