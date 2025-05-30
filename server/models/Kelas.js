const mongoose = require('mongoose');

const kelasSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jurusan: { type: String, required: true },
});

module.exports = mongoose.model('Kelas', kelasSchema); 