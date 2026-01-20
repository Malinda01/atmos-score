const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather.routes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

app.use(express.json());
app.use("/api/weather", weatherRoutes);

module.exports = app;
