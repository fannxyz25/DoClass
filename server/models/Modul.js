const mongoose = require('mongoose');

const modulSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  isi: { type: String, required: true },
  kelas: { type: mongoose.Schema.Types.ObjectId, ref: 'Kelas' },
});

module.exports = mongoose.model('Modul', modulSchema); 