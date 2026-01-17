const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const weatherRoutes = require("./routes/weather.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRoutes);

module.exports = app;
