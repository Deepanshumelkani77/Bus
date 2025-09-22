const express = require('express');
const router = express.Router();
const { listBuses, listCities, seedBuses } = require('../controller/busController');

router.get('/', listBuses); // /buses
router.get('/cities', listCities); // /buses/cities
router.post('/seed', seedBuses); // /buses/seed (dev)

module.exports = router;
