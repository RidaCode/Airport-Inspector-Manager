require("dotenv").config({ path: "../.env" });
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cors = require("cors");

// to fix the CORS error when fetching from the frontend
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

connectDB();
app.listen(port, () => console.log(`Server started on port ${port}`));
app.use("/api/arrivals", require("./routes/arrivalsRoutes"));
app.use("/api/departures", require("./routes/departuresRoutes"));

// close connections to DB when server process ends
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed");
    process.exit(0);
  });
});
