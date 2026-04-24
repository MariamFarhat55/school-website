const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' });
  next();
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = new User({ name, email, password, role: 'teacher' });
    await user.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status === 'pending')
      return res.status(403).json({ message: 'Account pending approval' });
    if (user.status === 'rejected')
      return res.status(403).json({ message: 'Account rejected' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      role: user.role,
      name: user.name,
      teacherId: user.teacherId || null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/approve/:id - admin only
router.patch('/approve/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: 'Approved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/reject/:id - admin only
router.patch('/reject/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'Rejected successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/teachers - admin only
router.get('/teachers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .populate('teacherId');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/approve-by-teacher/:teacherId - admin only
router.patch('/approve-by-teacher/:teacherId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { teacherId: req.params.teacherId },
      { status: 'approved' }
    );
    res.json({ message: 'Approved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = { router, authMiddleware, adminMiddleware };