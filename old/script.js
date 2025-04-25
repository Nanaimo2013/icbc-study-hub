const toggleBtn = document.getElementById('toggleMode');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Load questions from questions.json
let questions = [];
let currentIndex = 0;
let correctCount = 0;

// Fetch questions from the JSON file
fetch('questions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    questions = data.questions;
    // Initialize the quiz or flashcard mode
    if (document.title.includes("Flashcard")) {
      displayFlashcard();
    } else if (document.title.includes("Practice Test")) {
      displayQuestion();
    }
  })
  .catch(error => console.error('Error loading questions:', error));

// Flashcard mode functionality
function displayFlashcard() {
  if (currentIndex < questions.length) {
    document.getElementById('question').innerText = questions[currentIndex].question;
    document.getElementById('answer').innerText = questions[currentIndex].answer;
    document.getElementById('answer').style.display = 'none';
    document.getElementById('progress').innerText = `Flashcard ${currentIndex + 1} of ${questions.length}`;
  } else {
    endFlashcards();
  }
}

function endFlashcards() {
  document.querySelector('.flashcard-container').innerHTML = `<h2>You've completed the flashcards!</h2><p>Correct answers: ${correctCount} out of ${questions.length}</p>`;
}

// Practice test functionality
function displayQuestion() {
  if (currentIndex < questions.length) {
    document.getElementById('question').innerText = questions[currentIndex].question;
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    questions[currentIndex].choices.forEach(choice => {
      const button = document.createElement('button');
      button.innerText = choice;
      button.classList.add('choice-btn');
      button.addEventListener('click', () => selectAnswer(choice));
      choicesContainer.appendChild(button);
    });

    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('progress').innerText = `Question ${currentIndex + 1} of ${questions.length}`;
  } else {
    endQuiz();
  }
}

function selectAnswer(selectedChoice) {
  const correctAnswer = questions[currentIndex].answer;
  if (selectedChoice === correctAnswer) {
    correctCount++;
  }
  document.getElementById('nextBtn').style.display = 'block';
  const choiceButtons = document.querySelectorAll('.choice-btn');
  choiceButtons.forEach(button => {
    button.disabled = true; // Disable all buttons after selection
    if (button.innerText === correctAnswer) {
      button.classList.add('correct');
    } else {
      button.classList.add('incorrect');
    }
  });
}

function endQuiz() {
  document.querySelector('.quiz-container').innerHTML = `<h2>Quiz Completed!</h2><p>Correct answers: ${correctCount} out of ${questions.length}</p>`;
}

// Event listener for the next button in practice test mode
document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex++;
  displayQuestion();
});

// Event listener for showing the answer in flashcard mode
document.getElementById('showAnswerBtn').addEventListener('click', () => {
  document.getElementById('answer').style.display = 'block';
});

// Event listener for the next card button in flashcard mode
document.getElementById('nextCardBtn').addEventListener('click', () => {
  if (currentIndex < questions.length) {
    // Track if the answer was correct or not
    if (document.getElementById('answer').style.display === 'block') {
      correctCount++;
    }
    currentIndex++;
    displayFlashcard();
  }
});