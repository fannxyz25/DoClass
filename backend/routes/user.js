const express = require('express');
const router = express.Router();
const User = require('../models/User');

// PATCH /api/users/:id/level - update level siswa
router.patch('/:id/level', async (req, res) => {
  try {
    const { level } = req.body;
    if (!level) return res.status(400).json({ message: 'Level harus diisi' });
    const user = await User.findByIdAndUpdate(req.params.id, { current_level: level }, { new: true });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 