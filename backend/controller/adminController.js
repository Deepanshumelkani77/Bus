const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /admin-auth/login
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Contact system administrator.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email, 
        role: admin.role,
        permissions: admin.permissions
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return admin data (excluding password)
    const adminData = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    };

    res.json({
      message: 'Login successful',
      token,
      admin: adminData
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /admin-auth/create-admin (Super admin only)
async function createAdmin(req, res) {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Set default permissions based on role
    let defaultPermissions = [];
    if (role === 'admin') {
      defaultPermissions = ['manage_drivers', 'manage_buses', 'manage_routes', 'view_analytics', 'manage_trips'];
    } else if (role === 'moderator') {
      defaultPermissions = ['view_analytics', 'manage_trips'];
    }

    // Create new admin
    const newAdmin = new Admin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || defaultPermissions,
      createdBy: req.admin.adminId
    });

    await newAdmin.save();

    // Return admin data (excluding password)
    const adminData = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      permissions: newAdmin.permissions,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt
    };

    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminData
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /admin-auth/profile
async function getAdminProfile(req, res) {
  try {
    const admin = await Admin.findById(req.admin.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /admin-auth/profile
async function updateAdminProfile(req, res) {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update basic info
    if (name) admin.name = name.trim();
    if (email) {
      // Check if email is already taken by another admin
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: admin._id } 
      });
      if (existingAdmin) {
        return res.status(409).json({ message: 'Email already taken' });
      }
      admin.email = email.toLowerCase().trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set new password' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }

      admin.password = await bcrypt.hash(newPassword, 12);
    }

    await admin.save();

    // Return updated admin data (excluding password)
    const adminData = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    res.json({
      message: 'Profile updated successfully',
      admin: adminData
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /admin-auth/admins (Super admin only)
async function listAdmins(req, res) {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const admins = await Admin.find(query)
      .select('-password')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Admin.countDocuments(query);

    res.json({
      admins,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('List admins error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /admin-auth/admins/:id/status (Super admin only)
async function updateAdminStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean value' });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deactivating yourself
    if (admin._id.toString() === req.admin.adminId) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    admin.isActive = isActive;
    await admin.save();

    res.json({
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive
      }
    });

  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  loginAdmin,
  createAdmin,
  getAdminProfile,
  updateAdminProfile,
  listAdmins,
  updateAdminStatus
};
