const express = require('express');
const router = express.Router();
const Ujian = require('../models/Ujian');

// POST /api/ujian - buat ujian baru
router.post('/', async (req, res) => {
  try {
    const ujian = new Ujian(req.body);
    await ujian.save();
    res.status(201).json({ message: 'Ujian berhasil dibuat', ujian });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/ujian/:level - ambil ujian berdasarkan level
router.get('/:level', async (req, res) => {
  try {
    const ujian = await Ujian.findOne({ level: req.params.level });
    if (!ujian) return res.status(404).json({ message: 'Ujian tidak ditemukan' });
    res.json(ujian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 