const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db');
const Quiz = require('./quizModel');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

connectDB();

app.get('/api/quizzes', async (request, respond) => {
  try {
    const quizzes = await Quiz.find();
    respond.json(quizzes);
  } catch (error) {
    respond.status(500).json({ message: error.message });
  }
});

app.post('/api/quizzes', async (request, respond) => {
  const quiz = new Quiz({
    question: request.body.question,
    options: request.body.options,
    correctAnswer: request.body.correctAnswer,
    category: request.body.category || 'General'
  });

  try {
    const newQuiz = await quiz.save();
    respond.status(201).json(newQuiz);
  } catch (error) {
    respond.status(400).json({ message: error.message });
  }
});

app.post('/api/quizzes/submit', async (request, respond) => {
  try {

    const { answers } = request.body;
    const quizzes = await Quiz.find({ _id: { $in: Object.keys(answers) } });
    
    let score = 0;
    const results = quizzes.map(quiz => {
      const isCorrect = quiz.correctAnswer === answers[quiz._id];
      if (isCorrect) score++;
      return {
        question: quiz.question,
        yourAnswer: answers[quiz._id],
        correctAnswer: quiz.correctAnswer,
        isCorrect
      };
    });

    respond.json({ score, total: quizzes.length, results });
  } catch (error) {
    respond.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});