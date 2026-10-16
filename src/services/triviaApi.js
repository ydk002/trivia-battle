// Open Trivia Database API Service + Fallback Data

export function decodeHtml(html) {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fallback questions in case of network issues or OpenTDB rate limits
const FALLBACK_QUESTIONS = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: [
      "Central Process Unit",
      "Computer Personal Unit",
      "Central Processor Utility"
    ]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "In web design, what does CSS stand for?",
    correct_answer: "Cascading Style Sheets",
    incorrect_answers: [
      "Counter Strike: Source",
      "Corrective Style Software",
      "Computer Style System"
    ]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "How many days are in a leap year?",
    correct_answer: "366",
    incorrect_answers: ["365", "364", "367"]
  },
  {
    category: "Science & Nature",
    type: "multiple",
    difficulty: "medium",
    question: "What is the chemical symbol for Gold?",
    correct_answer: "Au",
    incorrect_answers: ["Ag", "Fe", "Gd"]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "medium",
    question: "What year was the JavaScript programming language created?",
    correct_answer: "1995",
    incorrect_answers: ["1991", "1998", "2001"]
  },
  {
    category: "Geography",
    type: "multiple",
    difficulty: "easy",
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["Berlin", "Madrid", "Rome"]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "hard",
    question: "Which of the following is NOT an operating system kernel?",
    correct_answer: "V8",
    incorrect_answers: ["Mach", "Linux", "XNU"]
  },
  {
    category: "Entertainment: Video Games",
    type: "multiple",
    difficulty: "easy",
    question: "Who is Mario's brother in the Nintendo franchise?",
    correct_answer: "Luigi",
    incorrect_answers: ["Wario", "Bowser", "Toad"]
  }
];

export const CATEGORIES = [
  { id: '', name: 'Minden kategória (Vegyes)' },
  { id: '18', name: 'Számítástechnika & Tech' },
  { id: '9', name: 'Általános műveltség' },
  { id: '17', name: 'Tudomány & Természet' },
  { id: '23', name: 'Történelem' },
  { id: '21', name: 'Sport' },
  { id: '11', name: 'Filmek & Mozi' },
  { id: '12', name: 'Zene' },
  { id: '15', name: 'Videójátékok' }
];

export const DIFFICULTIES = [
  { id: '', label: 'Bármilyen', color: '#818cf8' },
  { id: 'easy', label: 'Könnyű (Easy)', color: '#34d399' },
  { id: 'medium', label: 'Közepes (Medium)', color: '#fbbf24' },
  { id: 'hard', label: 'Nehéz (Hard)', color: '#f87171' }
];

export async function fetchTriviaQuestions({ amount = 5, category = '', difficulty = '' }) {
  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP hiba: ${response.status}`);
    }
    const data = await response.json();

    // response_code: 0 = Success, 1 = No Results, 2 = Invalid Parameter, 4 = Token Empty, 5 = Rate Limit
    if (data.response_code === 0 && data.results && data.results.length > 0) {
      return formatQuestions(data.results);
    } else {
      console.warn("OpenTDB API nem adott vissza eredményt, fallback adatok használata...");
      return getFallbackFormatted(amount, difficulty);
    }
  } catch (err) {
    console.error("API lekérés hiba, fallback használata:", err);
    return getFallbackFormatted(amount, difficulty);
  }
}

function formatQuestions(rawQuestions) {
  return rawQuestions.map((q, idx) => {
    const decodedQuestion = decodeHtml(q.question);
    const decodedCorrect = decodeHtml(q.correct_answer);
    const decodedIncorrect = q.incorrect_answers.map(ans => decodeHtml(ans));
    const allAnswers = shuffleArray([decodedCorrect, ...decodedIncorrect]);

    return {
      id: `q-${idx}-${Date.now()}`,
      question: decodedQuestion,
      category: decodeHtml(q.category),
      difficulty: q.difficulty,
      correctAnswer: decodedCorrect,
      answers: allAnswers
    };
  });
}

function getFallbackFormatted(amount, difficulty) {
  let pool = FALLBACK_QUESTIONS;
  if (difficulty) {
    const filtered = pool.filter(q => q.difficulty === difficulty);
    if (filtered.length >= 3) pool = filtered;
  }
  const shuffled = shuffleArray(pool).slice(0, Math.min(amount, pool.length));
  return formatQuestions(shuffled);
}
