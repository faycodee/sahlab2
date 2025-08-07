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
console.log("Loading LesenRoutes...");
const LesenRoutes = require("./routes/LesenRoutes");
console.log("LesenRoutes type:", typeof LesenRoutes);
console.log("LesenRoutes value:", LesenRoutes);

console.log("Loading horenRoutes...");
const horenRoutes = require("./routes/horenRoutes");
console.log("horenRoutes type:", typeof horenRoutes);
console.log("horenRoutes value:", horenRoutes);

console.log("Loading SchreibenRoutes...");
const SchreibenRoutes = require("./routes/SchreibenRoutes");
console.log("SchreibenRoutes type:", typeof SchreibenRoutes);
console.log("SchreibenRoutes value:", SchreibenRoutes);

app.use("/api/lesen", LesenRoutes); // Line 23 - this might be the issue
app.use("/api/horen", horenRoutes);
app.use("/api/schreiben", SchreibenRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
