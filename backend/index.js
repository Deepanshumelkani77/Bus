const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

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

    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
}

start();