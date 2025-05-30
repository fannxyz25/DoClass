const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Modul = require('../models/Modul');
const Kelas = require('../models/kelas');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/modules';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept common document formats
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Gunakan PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, atau TXT.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Get all modules for a class
router.get('/kelas/:kelasId', async (req, res) => {
    try {
        const modules = await Modul.find({ kelasId: req.params.kelasId })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single module
router.get('/:id', async (req, res) => {
    try {
        const modul = await Modul.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('kelasId', 'nama');
        if (!modul) {
            return res.status(404).json({ message: 'Modul tidak ditemukan' });
        }
        res.json(modul);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new module with file upload
router.post('/kelas/:kelasId', upload.single('file'), async (req, res) => {
    try {
        const { judul, deskripsi, userId } = req.body;
        const { kelasId } = req.params;
        const file = req.file;

        // Validate input
        if (!judul || !deskripsi || !file || !userId) {
            // Delete uploaded file if validation fails
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({ message: 'Judul, deskripsi, file, dan userId harus diisi' });
        }

        // Check if class exists
        const kelas = await Kelas.findById(kelasId);
        if (!kelas) {
            // Delete uploaded file if class not found
            fs.unlinkSync(file.path);
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        // Create new module
        const modul = new Modul({
            judul,
            deskripsi,
            fileUrl: file.path,
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            kelasId,
            createdBy: userId
        });

        const savedModul = await modul.save();
        res.status(201).json({
            message: 'Modul berhasil dibuat',
            modul: savedModul
        });
    } catch (error) {
        // Delete uploaded file if saving fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
});

// Delete module
router.delete('/:id', async (req, res) => {
    try {
        const modul = await Modul.findById(req.params.id);
        if (!modul) {
            return res.status(404).json({ message: 'Modul tidak ditemukan' });
        }

        // Delete file from storage
        if (modul.fileUrl && fs.existsSync(modul.fileUrl)) {
            fs.unlinkSync(modul.fileUrl);
        }

        await modul.deleteOne();
        res.json({ message: 'Modul berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Download module file
router.get('/download/:id', async (req, res) => {
    try {
        const modul = await Modul.findById(req.params.id);
        if (!modul) {
            return res.status(404).json({ message: 'Modul tidak ditemukan' });
        }

        if (!fs.existsSync(modul.fileUrl)) {
            return res.status(404).json({ message: 'File tidak ditemukan' });
        }

        res.download(modul.fileUrl, modul.fileName);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 