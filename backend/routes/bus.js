const express = require('express');
const router = express.Router();
const { listBuses, listCities, seedBuses, assignBusToDriver, createBus, updateBus, deleteBus } = require('../controller/busController');
const { authenticateAdminToken, requirePermission } = require('../middleware/adminAuth');

// Public routes (for viewing)
router.get('/', authenticateAdminToken, listBuses); // /buses
router.get('/cities', authenticateAdminToken, listCities); // /buses/cities

// Admin protected routes
router.post('/seed', authenticateAdminToken, requirePermission('manage_buses'), seedBuses); // /buses/seed (dev)
router.post('/assign', authenticateAdminToken, requirePermission('manage_buses'), assignBusToDriver); // /buses/assign
router.post('/', authenticateAdminToken, requirePermission('manage_buses'), createBus); // /buses
router.put('/:id', authenticateAdminToken, requirePermission('manage_buses'), updateBus); // /buses/:id
router.delete('/:id', authenticateAdminToken, requirePermission('manage_buses'), deleteBus); // /buses/:id

module.exports = router;
