const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const KelasSchema = new Schema({
  kode: {
    type: String,
    required: [true, 'Kode kelas harus diisi'],
    unique: true,
    index: true
  },
  nama: {
    type: String,
    required: [true, 'Nama kelas harus diisi']
  },
  jurusan: {
    type: String,
  },
  guru: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Guru harus diisi'],
    index: true
  },
  enrolledStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  ujian: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      level: String,
      soal: [
        {
          pertanyaan: String,
          opsi: [String],
          jawaban_benar: String
        }
      ],
      min_score: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  hasilUjian: [
    {
      ujianId: { type: Schema.Types.ObjectId },
      siswa: { type: Schema.Types.ObjectId, ref: 'User' },
      nama: String,
      jawaban: [String],
      score: Number,
      passed: Boolean,
      waktu: { type: Date, default: Date.now }
    }
  ],
  historiHasilUjian: [
    {
      ujian: {
        level: String,
        soal: [
          {
            pertanyaan: String,
            opsi: [String],
            jawaban_benar: String
          }
        ],
        min_score: Number
      },
      hasil: [
        {
          siswa: { type: Schema.Types.ObjectId, ref: 'User' },
          nama: String,
          jawaban: [String],
          score: Number,
          passed: Boolean,
          waktu: { type: Date }
        }
      ],
      resetAt: { type: Date, default: Date.now }
    }
  ]
});

// Generate random kode kelas
KelasSchema.statics.generateKode = function() {
  // Format: XXXX-XXXX (X = alphanumeric)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let kode = '';
  
  // Generate first part
  for(let i = 0; i < 4; i++) {
    kode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  kode += '-'; // Add separator
  
  // Generate second part
  for(let i = 0; i < 4; i++) {
    kode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return kode;
};

module.exports = mongoose.model('Kelas', KelasSchema); 