const express = require('express');
const router = express.Router();
const Kelas = require('../Kelas');
const User = require('../User');

// Get all kelas
router.get('/', async (req, res) => {
  try {
    const kelas = await Kelas.find().populate('guru', 'username');
    res.json(kelas);
  } catch (error) {
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

// Create new kelas (only for teachers)
router.post('/', async (req, res) => {
  try {
    const { nama, jurusan, guruId } = req.body;

    // Validate input
    if (!nama || !jurusan || !guruId) {
      return res.status(400).json({ message: 'Nama, jurusan, dan ID guru harus diisi' });
    }

    // Check if the user is a teacher
    const guru = await User.findById(guruId);
    if (!guru || guru.role !== 'guru') {
      return res.status(403).json({ message: 'Hanya guru yang dapat membuat kelas' });
    }

    // Generate unique kode
    const kode = await generateUniqueKode();
    
    const kelas = new Kelas({
      kode,
      nama,
      jurusan,
      guru: guruId,
      enrolledStudents: []
    });

    const newKelas = await kelas.save();
    res.status(201).json({
      message: 'Kelas berhasil dibuat',
      kelas: newKelas
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join kelas (for students)
router.post('/join', async (req, res) => {
  try {
    const { userId, kodeKelas } = req.body;

    // Validate input
    if (!userId || !kodeKelas) {
      return res.status(400).json({ message: 'User ID dan Kode Kelas diperlukan' });
    }

    // Check if user exists and is a student
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    if (user.role !== 'siswa') {
      return res.status(403).json({ message: 'Hanya siswa yang dapat bergabung ke kelas' });
    }

    // Find kelas by kode
    const kelas = await Kelas.findOne({ kode: kodeKelas });
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    // Check if student is already enrolled
    if (user.enrolledKelas && user.enrolledKelas.includes(kelas._id)) {
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

    res.status(200).json({ 
      message: 'Berhasil bergabung ke kelas',
      kelas: kelas
    });
  } catch (error) {
    console.error('Error joining kelas:', error);
    res.status(500).json({ message: 'Gagal bergabung ke kelas' });
  }
});

// Helper function to generate unique kode
async function generateUniqueKode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let kode;

  while (!isUnique) {
    kode = '';
    // Generate 6 character code
    for (let i = 0; i < 6; i++) {
      kode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code exists
    const existingKelas = await Kelas.findOne({ kode });
    if (!existingKelas) {
      isUnique = true;
    }
  }

  return kode;
}

module.exports = router; 