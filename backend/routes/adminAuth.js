const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, updateAdminProfile } = require('../controller/adminController');
const { authenticateAdminToken, requireSuperAdmin } = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');

// POST /admin-auth/login
router.post('/login', loginAdmin);

// GET /admin-auth/profile (protected)
router.get('/profile', authenticateAdminToken, getAdminProfile);

// PUT /admin-auth/profile (protected)
router.put('/profile', authenticateAdminToken, updateAdminProfile);

// Temporary endpoint to create admin (remove after use)
router.post('/create-super-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const Admin = require('../models/Admin');
    
    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      return res.json({ 
        message: 'Super admin already exists', 
        email: existingSuperAdmin.email 
      });
    }

    // Create super admin
    const superAdminData = {
      name: 'Super Admin',
      email: 'deepumelkani123@gmail.com',
      password: await bcrypt.hash('hack77', 12),
      role: 'super_admin',
      permissions: [
        'manage_drivers',
        'manage_buses',
        'manage_routes',
        'view_analytics',
        'manage_trips',
        'system_settings'
      ],
      isActive: true
    };

    const superAdmin = new Admin(superAdminData);
    await superAdmin.save();

    res.json({
      message: 'Super admin created successfully!',
      email: 'deepumelkani123@gmail.com',
      password: 'hack77',
      warning: 'Please change the password after first login!'
    });

  } catch (error) {
    console.error('Error creating super admin:', error);
    res.status(500).json({ message: 'Failed to create super admin', error: error.message });
  }
});

module.exports = router;
