const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const teachersRouter = require('./routes/teachers');
const achievementsRouter = require('./routes/achievements');
const { router: authRouter } = require('./routes/auth');
const videosRouter = require('./routes/videos');


app.use('/api/auth', authRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/videos', videosRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));