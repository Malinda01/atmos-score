# Atmos Score - Weather Analytics Dashboard

A full-stack weather analytics application that retrieves real-time weather data, calculates a custom "Comfort Index" score, and ranks cities based on their suitability for outdoor activities.

## 1. Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- An OpenWeatherMap API Key
- Auth0 Account (for authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Malinda01/atmos-score
cd atmos-score

```

2. **Server Setup**
   Navigate to the server directory and install dependencies:

```bash
cd server

npm install axios cors dotenv express express-oauth2-jwt-bearer node-cache nodemon

```

Create a `.env` file in the `server/` directory: <br>
Copy and paste the API key from OpenWeather

```env
PORT=5000
OPENWEATHER_API_KEY=your_openweathermap_api_key

```

Start the backend server:

```bash
node index.js

```

3. **Client Setup**
   Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install @auth0/auth0-react @tailwindcss/vite axios react react-dom react-router-dom

```

Run the frontend with this:

```bash
npm run dev

```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5173`.

---

## 2. Explanation of Comfort Index Formula

The **Comfort Index** is a custom metric designed to score weather conditions on a scale of **0 to 100**. <br>(100 represents "perfect" comfort.)

The formula used is:

```javascript
Score = 100 - ( |Temp - 22| * 2  +  |Humidity - 50| * 0.5  +  WindSpeed * 2 )

```

_The final score is clamped between 0 and 100._

### How it works:

- **Baseline:** Starts with a perfect score of 100.
- **Penalties:** Points are subtracted based on how far current conditions deviate from the "ideal" state.

---

## 3. Reasoning Behind Variable Weights

The weights were chosen to prioritize human thermal regulation and physical comfort:

1. **Temperature (Weight: 2.0)**

- **Ideal:** 22°C (Room temperature).
- **Reasoning:** Temperature is the most critical factor for human comfort. A deviation of just a few degrees is immediately noticeable.
- **Impact:** A 5°C difference (e.g., 27°C or 17°C) results in a **10-point penalty**. This high weight ensures that extreme heat or cold drastically lowers the score.

2. **Wind Speed (Weight: 2.0)**

- **Ideal:** 0 m/s (Calm).
- **Reasoning:** High winds can make pleasant temperatures feel miserable (wind chill) or make outdoor activities difficult.
- **Impact:** Strong winds are penalized heavily. A moderate breeze of 5 m/s results in a **10-point penalty**, similar to a significant temperature shift.

3. **Humidity (Weight: 0.5)**

- **Ideal:** 50% Relative Humidity.
- **Reasoning:** Humidity is less immediately perceptible than temperature or wind unless it is extreme. Humans tolerate a wide range (30-70%) fairly well.
- **Impact:** A 20% deviation (e.g., 70% humidity) results in only a **10-point penalty**. This lower weight prevents humidity from overpowering the score unless conditions are tropical or arid.

---

## 4. Trade-offs Considered

- **In-Memory Caching (Node-Cache) vs. Redis:**
- _Decision:_ Used `node-cache` (in-memory).
- _Trade-off:_ While Redis allows for a distributed cache that survives server restarts, `node-cache` was chosen for simplicity and zero external infrastructure dependencies. The trade-off is that cache data is lost if the server process restarts.

- **Auth0 Integration:**
- _Decision:_ Used Auth0 for authentication.
- _Trade-off:_ Provides high security and easy setup but introduces a dependency on an external service. Implementing custom JWT auth would have offered more control but significantly higher development time and security risk.

---

## 5. Cache Design Explanation

The system implements a **Two-Layer Caching Strategy** to minimize API costs and latency.

### Layer 1: Dashboard Cache (Processed)

- **Key:** `dashboard_processed`
- **Content:** The fully calculated, sorted, and ranked list of cities.
- **Purpose:** Delivers 0ms response times for the majority of user requests. Bypasses all calculation logic.

### Layer 2: Raw API Cache (Granular)

- **Key:** `raw_{CityID}` (e.g., `raw_1248991`)
- **Content:** The raw JSON response from OpenWeatherMap.
- **Purpose:** If the dashboard cache expires, the system rebuilds it. It checks this layer first for each city. If valid data exists here, it avoids hitting the OpenWeatherMap API, preserving the API quota.

**TTL (Time-to-Live):** Both layers utilize a **5-minute (300 seconds)** expiration policy to ensure data freshness while adhering to API rate limits.

---

## 6. Known Limitations

1. **Fixed City List:** The application currently supports only the specific cities listed in `cities.json`. Adding new cities requires a code deployment.
2. **Server Restart Clears Cache:** Since the cache is stored in RAM, restarting the server forces a fresh fetch of all data from the API.
3. **Rate Limiting:** If the user base grows significantly and the cache expires, the sudden burst of requests to OpenWeatherMap to rebuild the cache could potentially hit the free-tier rate limits.
4. **Simple Comfort Formula:** The comfort index does not account for precipitation (rain/snow) directly, though it may indirectly capture it via humidity and temperature. A "Rain" status does not automatically set the score to 0.
