const express = require('express');
const router = express.Router();
const { listBuses, listCities, seedBuses, assignBusToDriver } = require('../controller/busController');

router.get('/', listBuses); // /buses
router.get('/cities', listCities); // /buses/cities
router.post('/seed', seedBuses); // /buses/seed (dev)
router.post('/assign', assignBusToDriver); // /buses/assign

module.exports = router;
