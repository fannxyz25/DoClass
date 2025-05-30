const mongoose = require('mongoose');
const { Schema } = mongoose;

const KelasEnrollmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kelasId: {
    type: Schema.Types.ObjectId,
    ref: 'Kelas',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

// Compound index to prevent duplicate enrollments
KelasEnrollmentSchema.index({ userId: 1, kelasId: 1 }, { unique: true });

module.exports = mongoose.model('KelasEnrollment', KelasEnrollmentSchema); 