const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, level, smkLevel } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Pengguna sudah terdaftar' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, level, smkLevel });
    await user.save();
    res.status(201).json({ message: 'Akun berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat akun', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, level } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Pengguna tidak ditemukan' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Kata sandi salah' });
    }

    // Validate user role
    if (user.level !== level) {
      return res.status(403).json({ 
        message: `Akun ini terdaftar sebagai ${user.level}, bukan ${level}` 
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, level: user.level },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Berhasil masuk',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        level: user.level,
        smkLevel: user.smkLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal masuk', error: error.message });
  }
});

module.exports = router; 