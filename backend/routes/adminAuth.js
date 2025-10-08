const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  createAdmin,
  getAdminProfile,
  updateAdminProfile,
  listAdmins,
  updateAdminStatus
} = require('../controller/adminController');

const {
  authenticateAdminToken,
  requireSuperAdmin
} = require('../middleware/adminAuth');

// Public routes
router.post('/login', loginAdmin);

// Protected routes (require authentication)
router.get('/profile', authenticateAdminToken, getAdminProfile);
router.put('/profile', authenticateAdminToken, updateAdminProfile);

// Super admin only routes
router.post('/create-admin', authenticateAdminToken, requireSuperAdmin, createAdmin);
router.get('/admins', authenticateAdminToken, requireSuperAdmin, listAdmins);
router.put('/admins/:id/status', authenticateAdminToken, requireSuperAdmin, updateAdminStatus);

module.exports = router;
