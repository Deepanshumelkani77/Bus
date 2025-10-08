const express = require('express');
const router = express.Router();
const {
  listDrivers,
  listDriverCities,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controller/driverController');
const { authenticateAdminToken, requirePermission } = require('../middleware/adminAuth');

// Public routes (for viewing)
router.get('/', authenticateAdminToken, listDrivers); // /drivers
router.get('/cities', authenticateAdminToken, listDriverCities); // /drivers/cities

// Admin protected routes
router.post('/', authenticateAdminToken, requirePermission('manage_drivers'), createDriver); // /drivers
router.put('/:id', authenticateAdminToken, requirePermission('manage_drivers'), updateDriver); // /drivers/:id
router.delete('/:id', authenticateAdminToken, requirePermission('manage_drivers'), deleteDriver); // /drivers/:id

module.exports = router;
