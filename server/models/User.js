const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, enum: ['siswa', 'guru'], required: true },
  smkLevel: { type: String }, // contoh: X, XI, XII
});

module.exports = mongoose.model('User', userSchema); 