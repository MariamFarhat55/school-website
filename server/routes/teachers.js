const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Teacher = require('../models/Teacher');
const TeacherAchievement = require('../models/TeacherAchievement');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('./auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all teachers - anyone can view
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single teacher - anyone can view
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new teacher - teacher registers themselves
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { name, subject, bio, email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Create teacher profile
    const teacher = new Teacher({
      name, subject, bio, email, phone,
      photo: req.file ? req.file.filename : ''
    });
    await teacher.save();

    // Create user account linked to teacher
    const user = new User({
      name,
      email,
      password,
      role: 'teacher',
      teacherId: teacher._id
    });
    await user.save();

    res.status(201).json({ message: 'Registered successfully', teacherId: teacher._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET teacher achievements - anyone can view
router.get('/:id/achievements', async (req, res) => {
  try {
    const achievements = await TeacherAchievement.find({ teacherId: req.params.id });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST teacher achievement - teacher or admin only
router.post('/:id/achievements', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // Teacher can only add to their own profile
    if (req.user.role === 'teacher') {
      const user = await User.findById(req.user.id);
      if (user.teacherId.toString() !== req.params.id) {
        return res.status(403).json({ message: 'You can only add to your own profile' });
      }
    }

    const achievement = new TeacherAchievement({
      teacherId: req.params.id,
      ...req.body,
      file: req.file ? req.file.filename : ''
    });
    await achievement.save();
    res.status(201).json(achievement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE teacher achievement - teacher or admin only
router.delete('/:id/achievements/:achievementId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const user = await User.findById(req.user.id);
      if (user.teacherId.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    await TeacherAchievement.findByIdAndDelete(req.params.achievementId);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE teacher - admin only
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    await User.deleteOne({ teacherId: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;