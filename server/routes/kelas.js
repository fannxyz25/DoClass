const express = require('express');
const router = express.Router();
const Kelas = require('../models/Kelas');

// Ambil semua kelas
router.get('/', async (req, res) => {
  try {
    const kelas = await Kelas.find();
    res.json(kelas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kelas', error: error.message });
  }
});

// Buat kelas baru
router.post('/', async (req, res) => {
  try {
    const { nama, jurusan } = req.body;
    const kelas = new Kelas({ nama, jurusan });
    await kelas.save();
    res.status(201).json({ message: 'Kelas created', kelas });
  } catch (error) {
    res.status(500).json({ message: 'Error creating kelas', error: error.message });
  }
});

module.exports = router; 