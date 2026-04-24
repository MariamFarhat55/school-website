const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video');
const { authMiddleware, adminMiddleware } = require('../routes/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
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