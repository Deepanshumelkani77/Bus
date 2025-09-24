const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const busRoutes = require("./routes/bus");
app.use("/buses", busRoutes);
const tripRoutes = require("./routes/trips");
app.use("/trips", tripRoutes);

const PORT =  2000;

// Connect to MongoDB then start server
async function start() {
  try {
    const mongoUri = "mongodb+srv://deepumelkani123_db_user:Bus7777@cluster0.ax4xicv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    if (!mongoUri) {
      console.warn("⚠️ MONGO_URI not set in environment. Using default local mongodb://127.0.0.1:27017/busapp");
    }
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
}

start();