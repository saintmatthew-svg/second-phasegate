document.addEventListener('DOMContentLoaded', function() {
  const addQuizForm = document.getElementById('add-quiz-form');
  const startQuizBtn = document.getElementById('start-quiz');
  const quizContainer = document.getElementById('quiz-container');
  const quizForm = document.getElementById('quiz-form');
  const submitQuizBtn = document.getElementById('submit-quiz');
  const resultsDiv = document.getElementById('results');

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

  startQuizBtn.addEventListener('click', async function() {
    try {
      const response = await fetch('/api/quizzes');
      const quizzes = await response.json();
      
      if (quizzes.length === 0) {
        alert('No quizzes available. Please add some questions first.');
        return;
      }
      
      quizContainer.style.display = 'block';
      startQuizBtn.style.display = 'none';
      
      quizForm.innerHTML = '';
      quizzes.forEach((quiz, index) => {
        const quizItem = document.createElement('div');
        quizItem.className = 'quiz-item';
        quizItem.innerHTML = `
          <h3>${index + 1}. ${quiz.question}</h3>
          ${quiz.options.map((option, i) => `
            <div class="option">
              <input type="radio" id="q${index}-opt${i}" name="q${index}" value="${option}">
              <label for="q${index}-opt${i}">${option}</label>
            </div>
          `).join('')}
          <input type="hidden" name="quizId" value="${quiz._id}">
        `;
        quizForm.appendChild(quizItem);
      });
      
      submitQuizBtn.style.display = 'block';
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load quizzes');
    }
  });

  submitQuizBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(quizForm);
    const answers = {};
    
    const radioInputs = quizForm.querySelectorAll('input[type="radio"]:checked');
    radioInputs.forEach(input => {
      const questionId = input.name.substring(1);
      const quizId = input.closest('.quiz-item').querySelector('input[name="quizId"]').value;
      answers[quizId] = input.value;
    });
    
    try {
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers })
      });
      
      const result = await response.json();
      
      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = `
        <div class="score">Your score: ${result.score} out of ${result.total}</div>
        ${result.results.map(res => `
          <div class="result-item ${res.isCorrect ? 'correct' : 'incorrect'}">
            <p><strong>Question:</strong> ${res.question}</p>
            <p><strong>Your answer:</strong> ${res.yourAnswer}</p>
            <p><strong>Correct answer:</strong> ${res.correctAnswer}</p>
          </div>
        `).join('')}
      `;
    
      resultsDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit quiz');
    }
  });
});