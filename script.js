const words = [
    { dutch: "huis", turkish: "ev" },
    { dutch: "kat", turkish: "kedi" },
    { dutch: "hond", turkish: "köpek" },
    { dutch: "boek", turkish: "kitap" },
    { dutch: "water", turkish: "su" },
    { dutch: "brood", turkish: "ekmek" },
    { dutch: "auto", turkish: "araba" },
    { dutch: "boom", turkish: "ağaç" },
    { dutch: "zon", turkish: "güneş" },
    { dutch: "maan", turkish: "ay" }
];

let currentWordIndex = 0;
let score = 0;
const totalQuestions = words.length;

function initGame() {
    currentWordIndex = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    showNextWord();
}

function showNextWord() {
    if (currentWordIndex < totalQuestions) {
        document.getElementById('word-display').textContent = words[currentWordIndex].dutch;
        document.getElementById('answer').value = '';
    } else {
        endGame();
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const correctAnswer = words[currentWordIndex].turkish;
    
    if (userAnswer === correctAnswer) {
        score += 10;
        document.getElementById('score').textContent = score;
    }
    
    currentWordIndex++;
    showNextWord();
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}

function restartGame() {
    initGame();
}

// Oyunu başlat
initGame(); 