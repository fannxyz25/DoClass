const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../User');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password diperlukan' });
    }

    // Find user by email
    const user = await User.findOne({ email }).populate('enrolledKelas');
    if (!user) {
      return res.status(404).json({ message: 'Email tidak terdaftar' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Create user object without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      enrolledKelas: user.enrolledKelas,
      current_level: user.current_level,
      createdAt: user.createdAt
    };

    console.log('Login successful:', { 
      userId: userResponse._id,
      username: userResponse.username,
      role: userResponse.role
    });

    res.json({
      message: 'Login berhasil',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('Register attempt:', { username, email, role });

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'siswa',
      enrolledKelas: []
    });

    await user.save();

    // Create user response without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      enrolledKelas: [],
      current_level: user.current_level,
      createdAt: user.createdAt
    };

    console.log('Register successful:', {
      userId: userResponse._id,
      username: userResponse.username,
      role: userResponse.role
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: userResponse
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
});

module.exports = router; 