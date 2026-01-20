import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"; // Import Recharts

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 relative flex flex-col">
      {/* Rank Number */}
      <div className="absolute top-0 left-0 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
        Rank #{city.rank}
      </div>

      <div className="p-6 pb-2">
        {/* City Header */}
        <div className="flex justify-between items-start mb-4 mt-3">
          <div>
            <h2 className="text-xl font-bold truncate dark:text-gray-100">
              {city.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {city.condition}
            </p>
          </div>
          <div className="text-3xl font-light dark:text-gray-200">
            {city.temp}°C
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Humidity</span>
            <span className="font-medium dark:text-gray-300">
              {city.humidity}%
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Wind Speed</span>
            <span className="font-medium dark:text-gray-300">
              {city.windSpeed} m/s
            </span>
          </div>

          <div className="my-4 border-t border-gray-300 dark:border-gray-500"></div>

          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Comfort Score
            </span>
            <span className={`text-3xl font-bold ${getScoreColor(city.score)}`}>
              {city.score}
            </span>
          </div>
        </div>
      </div>

      {/* --- NEW: Temperature Trend Graph --- */}
      {city.trend && (
        <div className="h-24 w-full mt-auto mb-2">
          <div className="text-[10px] text-gray-400 px-6 mb-1 uppercase tracking-wide">
            24h Forecast
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={city.trend}>
              <defs>
                <linearGradient
                  id={`gradient-${city.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ display: "none" }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#60A5FA"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${city.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full ${getProgressBarColor(city.score)}`}
          style={{ width: `${city.score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WeatherCard;
