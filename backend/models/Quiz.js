const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true
      },
      options: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, required: true }
        }
      ]
    }
  ]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 