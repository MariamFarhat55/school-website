const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Video = require('../models/Video');
const { authMiddleware, adminMiddleware } = require('../routes/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'school/videos', allowed_formats: ['mp4', 'mov'], resource_type: 'video' }
});
const upload = multer({ storage });

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new video - admin only
router.post('/', authMiddleware, adminMiddleware, upload.single('video'), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      filename: req.file ? req.file.filename : ''
    });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE video - admin only
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;