const express = require('express');
const router = express.Router();
const Kelas = require('../models/kelas');
const User = require('../models/User');

// Get kelas based on role
router.get('/', async (req, res) => {
  try {
    const { userId, role } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID diperlukan' });
    }

    let query = {};
    
    // Jika role adalah guru, hanya tampilkan kelas yang dia buat
    if (role === 'guru') {
      query.guru = userId;
    }

    const kelas = await Kelas.find(query)
      .populate('guru', 'username')
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru
    
    res.json(kelas);
  } catch (error) {
    console.error('Error fetching kelas:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get kelas by ID
router.get('/:id', async (req, res) => {
  try {
    const kelas = await Kelas.findById(req.params.id)
      .populate('guru', 'username')
      .populate('enrolledStudents', 'username current_level');
    
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    
    res.json(kelas);
  } catch (error) {
    console.error('Error fetching kelas detail:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled kelas for a user
router.get('/enrolled/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('enrolledKelas');
    res.json(user.enrolledKelas || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new kelas (for guru)
router.post('/', async (req, res) => {
  try {
    const { nama, jurusan, guruId } = req.body;
    console.log('Creating kelas with data:', { nama, jurusan, guruId });

    // Validate input
    if (!nama || !jurusan || !guruId) {
      console.log('Missing required fields:', { nama, jurusan, guruId });
      return res.status(400).json({ message: 'Nama, jurusan, dan guru harus diisi' });
    }

    // Check if guru exists
    const guru = await User.findById(guruId);
    console.log('Found guru:', guru);
    
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' });
    }

    if (guru.role !== 'guru') {
      return res.status(403).json({ message: 'Hanya guru yang dapat membuat kelas' });
    }

    // Generate unique kode using the model's static method
    let kode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      kode = Kelas.generateKode(); // Using the static method from the model
      console.log('Generated kode:', kode);
      const existingKelas = await Kelas.findOne({ kode });
      if (!existingKelas) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      console.log('Failed to generate unique kode after', maxAttempts, 'attempts');
      return res.status(500).json({ message: 'Gagal membuat kode kelas unik' });
    }

    // Create new kelas
    const kelas = new Kelas({
      kode,
      nama: nama.trim(),
      jurusan: jurusan.trim(),
      guru: guruId,
      enrolledStudents: []
    });

    console.log('Attempting to save kelas:', kelas.toObject());
    const newKelas = await kelas.save();
    console.log('Kelas created successfully:', newKelas.toObject());
    
    res.status(201).json({
      message: `Kelas berhasil dibuat dengan kode: ${kode}`,
      kelas: newKelas
    });
  } catch (error) {
    console.error('Detailed error creating kelas:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ 
          message: 'Kode kelas sudah digunakan. Silakan coba lagi.' 
        });
      }
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validasi gagal: ' + messages.join(', ') 
      });
    }

    res.status(500).json({ 
      message: 'Gagal membuat kelas. Silakan coba lagi.' 
    });
  }
});

// Join kelas with kode (for siswa)
router.post('/join', async (req, res) => {
  try {
    const { userId, kode } = req.body;
    console.log('Join attempt:', { userId, kode });

    // Validate input
    if (!userId || !kode) {
      return res.status(400).json({ message: 'User ID dan Kode Kelas diperlukan' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Check if kelas exists
    const kelas = await Kelas.findOne({ kode });
    if (!kelas) {
      return res.status(404).json({ message: 'Kode kelas tidak valid' });
    }

    // Check if user is already enrolled
    const isEnrolled = user.enrolledKelas && user.enrolledKelas.some(k => k.toString() === kelas._id.toString());
    if (isEnrolled) {
      return res.status(400).json({ message: 'Sudah terdaftar di kelas ini' });
    }

    // Add kelas to user's enrolled kelas
    if (!user.enrolledKelas) {
      user.enrolledKelas = [];
    }
    user.enrolledKelas.push(kelas._id);
    await user.save();

    // Add user to kelas's enrolled students
    if (!kelas.enrolledStudents) {
      kelas.enrolledStudents = [];
    }
    kelas.enrolledStudents.push(userId);
    await kelas.save();

    console.log('Join successful:', { userId, kelasId: kelas._id, kode });

    res.status(200).json({
      message: 'Berhasil bergabung ke kelas',
      kelas: {
        _id: kelas._id,
        nama: kelas.nama,
        kode: kelas.kode,
        jurusan: kelas.jurusan,
        enrolled: true
      }
    });
  } catch (error) {
    console.error('Error joining kelas:', error);
    res.status(500).json({ message: 'Gagal bergabung ke kelas' });
  }
});

// Tambah ujian baru ke array ujian
router.post('/:id/ujian', async (req, res) => {
  try {
    const kelas = await Kelas.findById(req.params.id);
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    // Tambahkan ujian baru ke array
    kelas.ujian.push(req.body);
    await kelas.save();
    res.status(201).json({ message: 'Ujian berhasil dibuat', ujian: kelas.ujian });
  } catch (error) {
    console.error('Error creating ujian:', error);
    // Tambahkan log error detail
    res.status(500).json({ message: error.message, stack: error.stack, error });
  }
});

// Get ujian dari kelas, bisa filter by level
router.get('/:id/ujian', async (req, res) => {
  try {
    const kelas = await Kelas.findById(req.params.id);
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    let result = kelas.ujian || [];
    if (req.query.level) {
      result = result.filter(u => u.level === req.query.level);
    }
    res.json(result);
  } catch (error) {
    console.error('Error getting ujian:', error);
    res.status(500).json({ message: error.message });
  }
});

// Submit ujian untuk siswa (dengan ujianId)
router.post('/:id/ujian/submit', async (req, res) => {
  try {
    const kelas = await Kelas.findById(req.params.id);
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    const { ujianId, jawaban, userId, nama } = req.body;
    const ujian = kelas.ujian.id(ujianId);
    if (!ujian) {
      return res.status(404).json({ message: 'Ujian tidak ditemukan' });
    }
    let score = 0;
    ujian.soal.forEach((soal, idx) => {
      if (
        jawaban &&
        typeof jawaban[idx] !== 'undefined' &&
        String(jawaban[idx]).trim() === String(soal.jawaban_benar).trim()
      ) {
        score += 100 / ujian.soal.length;
      }
    });
    const passed = score >= (ujian.min_score || 70);
    // Simpan hasil ke kelas
    if (userId) {
      // Hapus hasil lama untuk ujian ini jika ada
      kelas.hasilUjian = (kelas.hasilUjian || []).filter(h => String(h.siswa) !== String(userId) || String(h.ujianId) !== String(ujianId));
      kelas.hasilUjian.push({ ujianId, siswa: userId, nama, jawaban, score, passed });
      await kelas.save();
    }
    res.json({ score, passed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint untuk guru melihat hasil ujian siswa untuk ujian tertentu
router.get('/:id/ujian/hasil', async (req, res) => {
  try {
    const kelas = await Kelas.findById(req.params.id).populate('hasilUjian.siswa', 'username');
    if (!kelas) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    let hasil = kelas.hasilUjian || [];
    if (req.query.ujianId) {
      hasil = hasil.filter(h => String(h.ujianId) === String(req.query.ujianId));
    }
    res.json(hasil);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 