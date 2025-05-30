const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username harus diisi'],
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi']
  },
  role: {
    type: String,
    enum: ['siswa', 'guru', 'admin'],
    default: 'siswa'
  },
  enrolledKelas: [{
    type: Schema.Types.ObjectId,
    ref: 'Kelas'
  }],
  current_level: {
    type: String,
    default: 'Level 0'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);