require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const admin = new User({
      name: 'Admin',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created successfully ✅');
    process.exit();
  })
  .catch(err => console.log(err));