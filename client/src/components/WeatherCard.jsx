const WeatherCard = ({ city }) => {
  // Helper to color-code the Comfort Score
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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 relative">
      {/* Ranking Badge */}
      <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
        Rank #{city.rank}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold truncate">{city.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{city.condition}</p>
          </div>
          <div className="text-3xl font-light">{city.temp}°C</div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Humidity</span>
            <span className="font-medium">{city.humidity}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Wind Speed</span>
            <span className="font-medium">{city.windSpeed} m/s</span>
          </div>

          <div className="my-4 border-t border-gray-200"></div>

          {/* Comfort Score Section */}
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Comfort Score
            </span>
            <span className={`text-4xl font-bold ${getScoreColor(city.score)}`}>
              {city.score}
            </span>
          </div>
        </div>
      </div>

      {/* Score Progress Bar Visual */}
      <div className="h-1.5 w-full bg-gray-200 mt-auto">
        <div
          className={`h-full ${getProgressBarColor(city.score)}`}
          style={{ width: `${city.score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WeatherCard;
