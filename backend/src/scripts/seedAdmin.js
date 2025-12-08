/**
 * Seed Script - Creates initial admin user
 * Run with: node src/scripts/seedAdmin.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const ADMIN_DATA = {
  email: 'admin@truckflow.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'TruckFlow',
  role: 'admin',
  phone: '+212600000000'
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', ADMIN_DATA.email);
      console.log('   If you need to reset, delete the user first.');
    } else {
      // Create admin user
      const admin = await User.create(ADMIN_DATA);
      console.log('✅ Admin user created successfully!');
      console.log('   Email:', admin.email);
      console.log('   Password:', ADMIN_DATA.password);
      console.log('   Role:', admin.role);
    }

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  }
};

seedAdmin();
