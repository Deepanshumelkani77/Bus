require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '5mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Make io available to routes
app.set('io', io);

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const userAuthRoutes = require("./routes/userAuth");
app.use("/user-auth", userAuthRoutes);
const adminAuthRoutes = require("./routes/adminAuth");
app.use("/admin-auth", adminAuthRoutes);
const busRoutes = require("./routes/bus");
app.use("/buses", busRoutes);
const tripRoutes = require("./routes/trips");
app.use("/trips", tripRoutes);
const routeRoutes = require("./routes/routes");
app.use("/routes", routeRoutes);
const googleRoutes=require("./routes/google.js");
app.use("/google",googleRoutes);
const smartTripRoutes = require("./routes/smartTrips");
app.use("/smart-trips", smartTripRoutes);
const driverRoutes = require("./routes/driver");
app.use("/drivers", driverRoutes);

const PORT = process.env.PORT || 2000;

// Connect to MongoDB then start server
async function start() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI not set in environment variables");
      console.log("Please set MONGO_URI in your .env file");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
    console.log(`🗄️  Database: ${mongoose.connection.name}`);

    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log('🔌 User connected:', socket.id);
      
      // Driver location updates
      socket.on('driver-location-update', (data) => {
        // Broadcast to all users tracking this trip
        socket.broadcast.emit('bus-location-update', data);
      });
      
      socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
      console.log(`🗝️  JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not Set'}`);
      console.log(`🗺️  Google API Key: ${process.env.GOOGLE_API_KEY ? 'Set' : 'Not Set'}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
}

start();