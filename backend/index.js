const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
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

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const userAuthRoutes = require("./routes/userAuth");
app.use("/user-auth", userAuthRoutes);
const busRoutes = require("./routes/bus");
app.use("/buses", busRoutes);
const tripRoutes = require("./routes/trips");
app.use("/trips", tripRoutes);
const routeRoutes = require("./routes/routes");
app.use("/routes", routeRoutes);
const googleRoutes=require("./routes/google.js");
app.use("/google",googleRoutes);

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

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join-trip', (tripId) => {
        socket.join(`trip-${tripId}`);
        console.log(`Client ${socket.id} joined trip ${tripId}`);
      });
      
      socket.on('leave-trip', (tripId) => {
        socket.leave(`trip-${tripId}`);
        console.log(`Client ${socket.id} left trip ${tripId}`);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Make io available to routes
    app.set('io', io);

    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
}

start();