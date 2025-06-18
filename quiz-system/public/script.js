document.addEventListener('DOMContentLoaded', function() {
  const roleSelection = document.getElementById('role-selection');
  const studentSection = document.getElementById('student-section');
  const adminSection = document.getElementById('admin-section');
  const quizSection = document.getElementById('quiz-section');
  const loginForm = document.getElementById('login-form');
  const quizContainer = document.getElementById('quiz-container');
  const quizForm = document.getElementById('quiz-form');
  const nextQuestionBtn = document.getElementById('next-question');
  const submitQuizBtn = document.getElementById('submit-quiz');
  const resultsDiv = document.getElementById('results');
  const currentQuestionDiv = document.getElementById('current-question');
  const addQuizForm = document.getElementById('add-quiz-form');

  let quizzes = [];
  let currentQuestionIndex = 0;
  let userAnswers = {};

  // Role selection
  document.getElementById('student-btn').addEventListener('click', function() {
    roleSelection.style.display = 'none';
    studentSection.style.display = 'block';
  });

  document.getElementById('admin-btn').addEventListener('click', function() {
    roleSelection.style.display = 'none';
    adminSection.style.display = 'block';
  });

  // Student login
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const studentName = document.getElementById('student-name').value;
    localStorage.setItem('studentName', studentName);
    
    try {
      const response = await fetch('/api/quizzes');
      quizzes = await response.json();
      
      if (quizzes.length === 0) {
        alert('No quizzes available. Please ask the admin to add some questions.');
        return;
      }
      
      studentSection.style.display = 'none';
      quizSection.style.display = 'block';
      showQuestion(0);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load quizzes');
    }
  });

  // Show current question
  function showQuestion(index) {
    if (index >= quizzes.length) {
      submitQuiz();
      return;
    }

    const quiz = quizzes[index];
    currentQuestionDiv.innerHTML = `<h3>Question ${index + 1} of ${quizzes.length}</h3>`;
    quizForm.innerHTML = `
      <div class="quiz-item">
        <h3>${quiz.question}</h3>
        ${quiz.options.map((option, i) => `
          <div class="option">
            <input type="radio" id="q${index}-opt${i}" name="q${index}" value="${option}">
            <label for="q${index}-opt${i}">${option}</label>
          </div>
        `).join('')}
        <input type="hidden" name="quizId" value="${quiz._id}">
      </div>
    `;

    if (index === quizzes.length - 1) {
      nextQuestionBtn.style.display = 'none';
      submitQuizBtn.style.display = 'block';
    } else {
      nextQuestionBtn.style.display = 'block';
      submitQuizBtn.style.display = 'none';
    }

    currentQuestionIndex = index;
  }

  // Next question
  nextQuestionBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(quizForm);
    const selectedOption = formData.get(`q${currentQuestionIndex}`);
    
    if (!selectedOption) {
      alert('Please select an answer');
      return;
    }

    const quizId = quizForm.querySelector('input[name="quizId"]').value;
    userAnswers[quizId] = selectedOption;
    showQuestion(currentQuestionIndex + 1);
  });

  // Submit quiz
  submitQuizBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(quizForm);
    const selectedOption = formData.get(`q${currentQuestionIndex}`);
    
    if (!selectedOption) {
      alert('Please select an answer');
      return;
    }

    const quizId = quizForm.querySelector('input[name="quizId"]').value;
    userAnswers[quizId] = selectedOption;
    submitQuiz();
  });

  async function submitQuiz() {
    try {
      const studentName = localStorage.getItem('studentName');
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          answers: userAnswers,
          studentName 
        })
      });
      
      const result = await response.json();
      
      quizContainer.style.display = 'none';
      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = `
        <h2>Quiz Results</h2>
        <div class="score">Your score: ${result.score} out of ${result.total}</div>
        ${result.results.map(res => `
          <div class="result-item ${res.isCorrect ? 'correct' : 'incorrect'}">
            <p><strong>Question:</strong> ${res.question}</p>
            <p><strong>Your answer:</strong> ${res.yourAnswer}</p>
            <p><strong>Correct answer:</strong> ${res.correctAnswer}</p>
          </div>
        `).join('')}
      `;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit quiz');
    }
  }

  // Admin add question
  addQuizForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const option4 = document.getElementById('option4').value;
    const correctAnswer = document.getElementById('correct-answer').value;
    const category = document.getElementById('category').value;
    
    const options = [option1, option2];
    if (option3) options.push(option3);
    if (option4) options.push(option4);
    
    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          category
        })
      });
      
      if (response.ok) {
        alert('Question added successfully!');
        addQuizForm.reset();
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      alert('Failed to add question: ' + error.message);
    }
  });
});