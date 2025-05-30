const express = require('express');
const router = express.Router();
const Modul = require('../models/Modul');

// Ambil semua modul
router.get('/', async (req, res) => {
  try {
    const modul = await Modul.find().populate('kelas');
    res.json(modul);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data modul', error: error.message });
  }
});

// Buat modul baru
router.post('/', async (req, res) => {
  try {
    const { judul, isi, kelas } = req.body;
    const modul = new Modul({ judul, isi, kelas });
    await modul.save();
    res.status(201).json({ message: 'Modul created', modul });
  } catch (error) {
    res.status(500).json({ message: 'Error creating modul', error: error.message });
  }
});

module.exports = router; 