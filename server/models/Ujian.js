const mongoose = require('mongoose');

const ujianSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  soal: [{
    pertanyaan: String,
    pilihan: [String],
    jawabanBenar: Number
  }],
  skorMinimum: { type: Number, required: true },
  kelas: { type: mongoose.Schema.Types.ObjectId, ref: 'Kelas' },
});

module.exports = mongoose.model('Ujian', ujianSchema); 