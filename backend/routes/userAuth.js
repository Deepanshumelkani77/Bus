const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helpers
function signToken(user) {
  const payload = { 
    id: user._id, 
    email: user.email, 
    city: user.city, 
    role: 'user' 
  };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /user-auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, city, phone } = req.body;
    
    // Validation
    if (!name || !email || !password || !city) {
      return res.status(400).json({ 
        message: 'Name, email, password, and city are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
      phone: phone || undefined
    });

    // Generate token
    const token = signToken(user);
    
    // Return user data without password
    const { password: _pw, ...userObj } = user.toObject();
    
    return res.status(201).json({ 
      token, 
      user: userObj,
      message: 'User account created successfully'
    });

  } catch (err) {
    console.error('User signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /user-auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = signToken(user);
    
    // Return user data without password
    const { password: _pw, ...userObj } = user.toObject();
    
    return res.json({ 
      token, 
      user: userObj,
      message: 'Login successful'
    });

  } catch (err) {
    console.error('User login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to check if user role
function requireUserRole(req, res, next) {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied. User role required.' });
  }
  next();
}

// GET /user-auth/profile (Protected route)
router.get('/profile', authenticateToken, requireUserRole, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favoriteRoutes')
      .populate('bookingHistory.trip');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /user-auth/profile (Protected route)
router.put('/profile', authenticateToken, requireUserRole, async (req, res) => {
  try {
    const { name, phone, city, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ 
      user,
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
