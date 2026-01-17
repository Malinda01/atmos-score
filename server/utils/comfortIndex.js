const calculateComfortIndex = (temp, humidity, windSpeed) => {
  const score =
    100 -
    (Math.abs(temp - 22) * 2 + Math.abs(humidity - 50) * 0.5 + windSpeed * 2);

  return Math.max(0, Math.min(100, Math.round(score)));
};

module.exports = calculateComfortIndex;
