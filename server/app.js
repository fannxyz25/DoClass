const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const kelasRoutes = require('./routes/kelas');
const modulRoutes = require('./routes/modul');
const ujianRoutes = require('./routes/ujian');

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/kelas', kelasRoutes);
app.use('/api/modul', modulRoutes);
app.use('/api/ujian', ujianRoutes);

module.exports = app; 