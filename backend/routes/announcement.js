const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// POST /api/announcement - buat pengumuman (global/kelas)
router.post('/', async (req, res) => {
  try {
    const { judul, isi, createdBy, kelasIds } = req.body;
    const pengumuman = new Announcement({ judul, isi, createdBy, kelasIds });
    await pengumuman.save();
    res.status(201).json(pengumuman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/announcement - ambil semua pengumuman global
router.get('/', async (req, res) => {
  try {
    const pengumuman = await Announcement.find({ $or: [ { kelasIds: { $exists: false } }, { kelasIds: { $size: 0 } } ] }).sort({ createdAt: -1 });
    res.json(pengumuman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/announcement/kelas/:id - ambil pengumuman untuk kelas tertentu + global
router.get('/kelas/:id', async (req, res) => {
  try {
    const kelasId = req.params.id;
    const pengumuman = await Announcement.find({
      $or: [
        { kelasIds: { $exists: false } },
        { kelasIds: { $size: 0 } },
        { kelasIds: kelasId }
      ]
    }).sort({ createdAt: -1 });
    res.json(pengumuman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 