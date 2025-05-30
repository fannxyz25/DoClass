const mongoose = require('mongoose');
const { Schema } = mongoose;

const UjianSchema = new Schema({
    level: String,
    soal: [
      {
        pertanyaan: String,
        opsi: [String],
        jawaban_benar: String
      }
    ],
    min_score: Number
  });
  module.exports = mongoose.model('Ujian', UjianSchema);