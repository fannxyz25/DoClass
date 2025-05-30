const express = require('express');
const router = express.Router();
const Ujian = require('../models/Ujian');

// Ambil semua ujian
router.get('/', async (req, res) => {
  try {
    const ujian = await Ujian.find().populate('kelas');
    res.json(ujian);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ujian', error: error.message });
  }
});

// Buat ujian baru
router.post('/', async (req, res) => {
  try {
    const { judul, soal, skorMinimum, kelas } = req.body;
    const ujian = new Ujian({ judul, soal, skorMinimum, kelas });
    await ujian.save();
    res.status(201).json({ message: 'Ujian created', ujian });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ujian', error: error.message });
  }
});

module.exports = router; 