const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

//Import routes
const Route = require("./routes/Route");

app.use(express.json());

//Route Middleware
app.use("/api", Route);
app.use(cors());

module.exports = app;
