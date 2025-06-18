document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const quizSection = document.getElementById('quiz-section');
  const studentInfo = document.getElementById('student-info');
  const studentNameDisplay = document.getElementById('student-name-display');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const studentName = document.getElementById('student-name').value;
    localStorage.setItem('studentName', studentName);
    studentNameDisplay.textContent = `Student: ${studentName}`;
    studentInfo.style.display = 'block';
    loginForm.style.display = 'none';
    quizSection.style.display = 'block';
  });
});
