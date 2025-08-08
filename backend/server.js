const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware
const allowedOrigins = ["http://localhost:5173", "https://sahlab2.vercel.app","https://adminsahlab2.vercel.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

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

console.log("Loading UserRoutes...");
const UserRoutes = require("./routes/UserRoutes");
console.log("UserRoutes type:", typeof UserRoutes);
console.log("UserRoutes value:", UserRoutes);

// Make upload middleware available to routes
app.locals.upload = upload;

app.use("/api/lesen", LesenRoutes);
app.use("/api/horen", horenRoutes);
app.use("/api/schreiben", SchreibenRoutes);
app.use("/api/users", UserRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
