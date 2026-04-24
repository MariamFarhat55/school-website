const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher'],
    default: 'teacher'
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending'
}
}, { timestamps: true });

// تشفير الباسورد قبل الحفظ
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// التحقق من الباسورد
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', userSchema);