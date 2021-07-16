const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const port = 5000;
//Import routes
const Route = require("./routes/Route");

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to database.")
);
app.use(express.json());

//Route Middleware
app.use("/api", Route);
app.use(cors());

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
