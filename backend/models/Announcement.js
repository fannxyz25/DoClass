const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
  judul: { type: String, required: true },
  isi: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  kelasIds: [{ type: Schema.Types.ObjectId, ref: 'Kelas' }], // kosong/null = broadcast semua kelas
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema); 