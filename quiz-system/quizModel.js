const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  category: { type: String, default: 'General' }
});

module.exports = mongoose.model('Quiz', quizSchema);