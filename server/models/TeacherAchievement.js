const mongoose = require('mongoose');

const teacherAchievementSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  file: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('TeacherAchievement', teacherAchievementSchema);