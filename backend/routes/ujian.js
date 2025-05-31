const express = require('express');
const router = express.Router();
const Ujian = require('../models/Ujian');

// POST /api/ujian - buat ujian baru
router.post('/', async (req, res) => {
  console.log('Received POST request to create quiz:', req.body);
  try {
    const ujian = new Ujian(req.body);
    console.log('New Ujian instance created:', ujian);
    await ujian.save();
    console.log('Ujian saved successfully:', ujian);
    res.status(201).json({ message: 'Ujian berhasil dibuat', ujian });
  } catch (error) {
    console.error('Error saving quiz:', error);
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

// PUT /api/ujian/:id - update ujian berdasarkan ID
router.put('/:id', async (req, res) => {
  console.log('Received PUT request for quiz ID:', req.params.id);
  console.log('Request body:', req.body);
  try {
    console.log('Attempting to find and update quiz with ID:', req.params.id);
    const ujian = await Ujian.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ujian) return res.status(404).json({ message: 'Ujian tidak ditemukan' });
    res.json({ message: 'Ujian berhasil diperbarui', ujian });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 