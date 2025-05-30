const express = require('express');
const router = express.Router();
const Kelas = require('../models/kelas');
const User = require('../models/User');

// Get basic stats
router.get('/', async (req, res) => {
  try {
    const totalKelas = await Kelas.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'siswa' });
    const totalTeachers = await User.countDocuments({ role: 'guru' });

    res.json({
      totalKelas,
      totalUsers,
      totalStudents,
      totalTeachers
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
});

module.exports = router; 