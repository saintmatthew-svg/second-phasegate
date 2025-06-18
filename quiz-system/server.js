const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db');
const Quiz = require('./quizModel');

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

connectDB();

const studentSchema = new mongoose.Schema({
  name: String,
  score: Number
});

const Student = mongoose.model('Student', studentSchema);

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

app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send({ error: 'Error saving student' });
  }
});

app.post('/api/quizzes/submit', async (req, res) => {
  try {
    const { answers, studentName } = req.body;
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

    const student = new Student({ name: studentName, score });
    await student.save();

    res.send({ score, total: quizzes.length, results });
  } catch (error) {
    res.status(500).send({ error: 'Error submitting quiz' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});