const axios = require("axios");
const cities = require("../data/cities.json");
const calculateComfortIndex = require("../utils/comfortIndex");

const fetchWeatherForCities = async () => {
  const promises = cities.List.map(async (city) => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const { temp, humidity } = res.data.main;
    const windSpeed = res.data.wind.speed;

    return {
      id: city.CityCode,
      name: city.CityName,
      temp: Math.round(temp),
      humidity,
      windSpeed,
      condition: res.data.weather[0].main,
      score: calculateComfortIndex(temp, humidity, windSpeed),
    };
  });

  const results = await Promise.all(promises);
  return results
    .sort((a, b) => b.score - a.score)
    .map((c, i) => ({ ...c, rank: i + 1 }));
};

module.exports = { fetchWeatherForCities };
