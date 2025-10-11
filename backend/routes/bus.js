const express = require('express');
const router = express.Router();
const { listBuses, listCities, seedBuses, assignBusToDriver, createBus, updateBus, deleteBus } = require('../controller/busController');
const { authenticateAdminToken, requirePermission } = require('../middleware/adminAuth');
const { authenticateToken } = require('../middleware/auth');

// Helper middleware to allow both admin and driver access
const authenticateAnyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_for_bus_app_2024_development_only';
    
    // Verify the token
    const decoded = jwt.verify(token, secret);
    
    // Check if it's an admin token (has adminId) or driver token (has id and role: 'driver')
    if (decoded.adminId) {
      // Admin token - verify admin exists and is active
      const Admin = require('../models/Admin');
      const admin = await Admin.findById(decoded.adminId);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: 'Invalid or inactive admin account' });
      }
      
      req.admin = {
        adminId: decoded.adminId,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions
      };
      req.user = decoded; // For compatibility
    } else if (decoded.id && decoded.role === 'driver') {
      // Driver token - no need to check admin database
      req.user = decoded;
    } else if (decoded.id) {
      // Could be driver token without explicit role, check if it has driver-like properties
      req.user = decoded;
    } else {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      console.error('Authentication error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Public routes (for viewing) - temporarily made public for testing
router.get('/', listBuses); // /buses - temporarily public
router.get('/cities', listCities); // /buses/cities - temporarily public

// Mixed access routes
router.post('/assign', authenticateAnyUser, assignBusToDriver); // /buses/assign - both admin and drivers can assign

// Admin protected routes
router.post('/seed', authenticateAdminToken, requirePermission('manage_buses'), seedBuses); // /buses/seed (dev)
router.post('/', authenticateAdminToken, requirePermission('manage_buses'), createBus); // /buses
router.put('/:id', authenticateAdminToken, requirePermission('manage_buses'), updateBus); // /buses/:id
router.delete('/:id', authenticateAdminToken, requirePermission('manage_buses'), deleteBus); // /buses/:id

module.exports = router;
