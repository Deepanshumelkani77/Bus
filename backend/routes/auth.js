const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');

const router = express.Router();

// Helpers
function signToken(driver) {
  const payload = { id: driver._id, email: driver.email, city: driver.city, role: 'driver' };
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_for_bus_app_2024_development_only';
  const expiresIn = '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: 'name, email, password, city are required' });
    }

    const exists = await Driver.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const driver = await Driver.create({ name, email, password: hash, city });

    const token = signToken(driver);
    const { password: _pw, ...driverObj } = driver.toObject();
    return res.status(201).json({ token, driver: driverObj });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  console.log("hello",req.body)
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(driver);
    const { password: _pw, ...driverObj } = driver.toObject();
    return res.json({ token, driver: driverObj });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
