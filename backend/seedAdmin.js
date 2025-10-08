const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

// MongoDB connection string
const mongoUri = "mongodb+srv://deepumelkani123_db_user:Bus7777@cluster0.ax4xicv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('⚠️ Super admin already exists:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const superAdminData = {
      name: 'Super Admin',
      email: 'deepumelkani123@gmail.com',
      password: await bcrypt.hash('hack77', 12),
      role: 'super_admin',
      permissions: [
        'manage_drivers',
        'manage_buses',
        'manage_routes',
        'view_analytics',
        'manage_trips',
        'system_settings'
      ],
      isActive: true
    };

    const superAdmin = new Admin(superAdminData);
    await superAdmin.save();

    console.log('✅ Super admin created successfully!');
    console.log('📧 Email: deepumelkani123@gmail.com');
    console.log('🔑 Password: hack77');
    console.log('⚠️ Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the seed function
createSuperAdmin();
