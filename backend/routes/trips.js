const express = require('express');
const router = express.Router();
const { createTrip } = require('../controller/tripController');

// POST /trips/create
router.post('/create', createTrip);

module.exports = router;
