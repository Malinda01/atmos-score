const WeatherCard = ({ city }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 relative">
      {/* Rank Number at the top */}
      <div className="absolute top-0 left-0 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
        Rank #{city.rank}
      </div>

      <div className="p-6">
        {/* City, condition, temp section */}
        <div className="flex justify-between items-start mb-4 mt-3">
          {/* City name and the condition */}
          <div>
            <h2 className="text-xl font-bold truncate dark:text-gray-100">
              {city.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {city.condition}
            </p>
          </div>
          {/* Temp */}
          <div className="text-3xl font-light dark:text-gray-200">
            {city.temp}°C
          </div>
        </div>

        {/* Humid, WindSpeed, Comfort zone section */}
        <div className="space-y-3">
          {/* Humidity */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Humidity</span>
            <span className="font-medium dark:text-gray-300">
              {city.humidity}%
            </span>
          </div>
          {/* -- */}
          {/* Windspeed */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Wind Speed</span>
            <span className="font-medium dark:text-gray-300">
              {city.windSpeed} m/s
            </span>
          </div>
          {/* -- */}

          {/* Separate line */}
          <div className="my-4 border-t border-gray-300 dark:border-gray-500"></div>

          {/* Comfort Score */}
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Comfort Score
            </span>
            <span className={`text-3xl font-bold ${getScoreColor(city.score)}`}>
              {city.score}
            </span>
          </div>
          {/* -- */}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 mt-auto">
        <div
          className={`h-full ${getProgressBarColor(city.score)}`}
          style={{ width: `${city.score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WeatherCard;
