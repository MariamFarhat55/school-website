const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const SchoolAchievement = require('../models/SchoolAchievement');
const { authMiddleware, adminMiddleware } = require('./auth');

// Multer setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'school/achievements', allowed_formats: ['jpg', 'png', 'jpeg'] }
});
const upload = multer({ storage });

// GET all achievements - anyone can view
router.get('/', async (req, res) => {
  try {
    const achievements = await SchoolAchievement.find().sort({ createdAt: -1 });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new achievement - admin only
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const achievement = new SchoolAchievement({
      ...req.body,
      image: req.file ? req.file.path : ''
    });
    await achievement.save();
    res.status(201).json(achievement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE achievement - admin only
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await SchoolAchievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET latest achievements for ticker
router.get('/ticker', async (req, res) => {
  try {
    const achievements = await SchoolAchievement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title');
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;