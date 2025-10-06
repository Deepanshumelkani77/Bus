const express = require('express');
const router = express.Router();
const {
  listDrivers,
  listDriverCities,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controller/driverController');

router.get('/', listDrivers); // /drivers
router.get('/cities', listDriverCities); // /drivers/cities
router.post('/', createDriver); // /drivers
router.put('/:id', updateDriver); // /drivers/:id
router.delete('/:id', deleteDriver); // /drivers/:id

module.exports = router;
