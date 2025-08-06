const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Routes
const LesenRoutes = require("./routes/LesenRoutes");
app.use("/api/lesen", LesenRoutes); // Base route for Lesen API

const hoerenRoutes = require("./routes/hörenRoutes");
app.use("/api/horen", hoerenRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
