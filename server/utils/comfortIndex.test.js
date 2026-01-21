const calculateComfortIndex = require("./comfortIndex");

describe("Comfort Index Calculator", () => {
  // 1. Test the "Perfect Day" scenario
  test("should return 100 for perfect conditions (22°C, 50% humidity, 0 wind)", () => {
    const result = calculateComfortIndex(22, 50, 0);
    expect(result).toBe(100);
  });

  // 2. Test a "Standard Day" scenario
  // Math: 100 - (|25-22|*2 + |60-50|*0.5 + 5*2)
  //     = 100 - (3*2 + 10*0.5 + 10)
  //     = 100 - (6 + 5 + 10) = 79
  test("should calculate correct score for standard conditions", () => {
    const result = calculateComfortIndex(25, 60, 5);
    expect(result).toBe(79);
  });

  // 3. Test the Lower Bound (0)
  // Ensure it doesn't return negative numbers
  test("should clamp the score to 0 for extreme conditions", () => {
    // Extreme: 50°C, 100% Humidity, 50 wind speed
    // This would mathematically be very negative, but should return 0
    const result = calculateComfortIndex(50, 100, 50);
    expect(result).toBe(0);
  });

  // 4. Test Cold Weather
  // Math: 100 - (|-5 - 22|*2 + |50-50|*0.5 + 10*2)
  //     = 100 - (27*2 + 0 + 20)
  //     = 100 - (54 + 20) = 26
  test("should handle cold temperatures correctly", () => {
    const result = calculateComfortIndex(-5, 50, 10);
    expect(result).toBe(26);
  });

  // 5. Test Floating Point Inputs
  // Ensure it rounds correctly as per your Math.round() logic
  test("should handle decimal inputs and round the result", () => {
    const result = calculateComfortIndex(22.5, 50.5, 2.3);
    // Because the function returns an integer (Math.round), we expect an integer
    expect(Number.isInteger(result)).toBe(true);
  });
});
