const router = require('express').Router();
const Kelas = require('../Kelas');
const User = require('../User');
const Modul = require('../Modul');

router.get('/guru', async (req, res) => {
    try {
        const [totalKelas, totalSiswa, totalModul] = await Promise.all([
            Kelas.countDocuments(),
            User.countDocuments({ role: 'siswa' }),
            Modul.countDocuments()
        ]);

        res.json({
            totalKelas,
            totalSiswa,
            totalModul
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
});

module.exports = router; 