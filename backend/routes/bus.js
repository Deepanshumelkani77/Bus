const express = require('express');
const router = express.Router();
const { listBuses, listCities, seedBuses, assignBusToDriver, createBus, updateBus, deleteBus } = require('../controller/busController');

router.get('/', listBuses); // /buses
router.get('/cities', listCities); // /buses/cities
router.post('/seed', seedBuses); // /buses/seed (dev)
router.post('/assign', assignBusToDriver); // /buses/assign
router.post('/', createBus); // /buses
router.put('/:id', updateBus); // /buses/:id
router.delete('/:id', deleteBus); // /buses/:id

module.exports = router;
