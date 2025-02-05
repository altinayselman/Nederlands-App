const wordCategories = {
    beginner: {
        name: 'Beginnersniveau',
        words: [
            { dutch: "hallo", english: "hello", icon: "fas fa-hand-wave", points: 5 },
            { dutch: "dag", english: "good day", icon: "fas fa-sun", points: 5 },
            { dutch: "doei", english: "goodbye", icon: "fas fa-hand", points: 5 },
            { dutch: "ja", english: "yes", icon: "fas fa-check-circle", points: 5 },
            { dutch: "nee", english: "no", icon: "fas fa-times-circle", points: 5 },
            { dutch: "dank je wel", english: "thank you", icon: "fas fa-heart", points: 5 },
            { dutch: "alsjeblieft", english: "please", icon: "fas fa-pray", points: 5 },
            { dutch: "goedemorgen", english: "good morning", icon: "fas fa-coffee", points: 5 },
            { dutch: "goedemiddag", english: "good afternoon", icon: "fas fa-sun", points: 5 },
            { dutch: "goedenavond", english: "good evening", icon: "fas fa-moon", points: 5 }
        ]
    },
    intermediate: {
        name: 'Middenniveau',
        words: [
            { dutch: "computer", english: "computer", icon: "fas fa-laptop", points: 10 },
            { dutch: "telefoon", english: "phone", icon: "fas fa-mobile-alt", points: 10 },
            { dutch: "boek", english: "book", icon: "fas fa-book", points: 10 },
            { dutch: "tafel", english: "table", icon: "fas fa-table", points: 10 },
            { dutch: "stoel", english: "chair", icon: "fas fa-chair", points: 10 },
            { dutch: "huis", english: "house", icon: "fas fa-home", points: 10 },
            { dutch: "school", english: "school", icon: "fas fa-school", points: 10 },
            { dutch: "werk", english: "work", icon: "fas fa-briefcase", points: 10 },
            { dutch: "eten", english: "food", icon: "fas fa-utensils", points: 10 },
            { dutch: "drinken", english: "drink", icon: "fas fa-glass-cheers", points: 10 }
        ]
    },
    advanced: {
        name: 'Gevorderd niveau',
        words: [
            { dutch: "verantwoordelijkheid", english: "responsibility", icon: "fas fa-clipboard-check", points: 15 },
            { dutch: "gebeurtenis", english: "event", icon: "fas fa-calendar-event", points: 15 },
            { dutch: "ontwikkeling", english: "development", icon: "fas fa-chart-line", points: 15 },
            { dutch: "belangrijk", english: "important", icon: "fas fa-exclamation-circle", points: 15 },
            { dutch: "ervaring", english: "experience", icon: "fas fa-star", points: 15 },
            { dutch: "samenwerking", english: "collaboration", icon: "fas fa-users", points: 15 },
            { dutch: "mogelijkheid", english: "possibility", icon: "fas fa-lightbulb", points: 15 },
            { dutch: "onderzoek", english: "research", icon: "fas fa-microscope", points: 15 },
            { dutch: "maatschappij", english: "society", icon: "fas fa-globe-europe", points: 15 },
            { dutch: "wetenschap", english: "science", icon: "fas fa-atom", points: 15 }
        ]
    }
};

let currentCategory = 'beginner';
let currentWordIndex = 0;
let score = 0;
let words = [];
let streak = 0;
let learnedWords = new Set();

function initGame() {
    createCategorySelector();
    resetGame();
}

function createCategorySelector() {
    const container = document.getElementById('category-container');
    container.innerHTML = `
        <div class="form-group">
            <label for="category-select" class="form-label">Kies een niveau:</label>
            <select class="form-select" id="category-select" onchange="changeCategory(this.value)">
                ${Object.entries(wordCategories).map(([key, category]) => 
                    `<option value="${key}">${category.name}</option>`
                ).join('')}
            </select>
        </div>
    `;
}

function changeCategory(newCategory) {
    currentCategory = newCategory;
    resetGame();
}

function resetGame() {
    currentWordIndex = 0;
    score = 0;
    streak = 0;
    words = [...wordCategories[currentCategory].words];
    shuffleWords();
    updateUI();
    showNextWord();
}

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    document.getElementById('learned-words').textContent = learnedWords.size;
    
    const progress = (currentWordIndex / words.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function showNextWord() {
    if (currentWordIndex < words.length) {
        const currentWord = words[currentWordIndex];
        const wordDisplay = document.getElementById('word-display');
        
        wordDisplay.innerHTML = `
            <div class="word-container">
                <div class="word-icon">
                    <i class="${currentWord.icon} fa-4x"></i>
                </div>
                <h2 class="dutch-word">${currentWord.dutch}</h2>
                <small class="text-muted">${currentWord.english}</small>
                <button onclick="playPronunciation('${currentWord.dutch}')" class="btn btn-sm btn-info mt-2">
                    <i class="fas fa-volume-up"></i> Uitspraak
                </button>
            </div>
        `;
        
        document.getElementById('answer').value = '';
        document.getElementById('answer').focus();
    } else {
        endGame();
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const currentWord = words[currentWordIndex];
    
    if (userAnswer === currentWord.english.toLowerCase()) {
        streak++;
        const bonusPoints = Math.floor(streak / 3) * 5;
        score += currentWord.points + bonusPoints;
        learnedWords.add(currentWord.dutch);
        showFeedback(true, bonusPoints);
    } else {
        streak = 0;
        showFeedback(false, currentWord.english);
    }
    
    currentWordIndex++;
    updateUI();
    
    setTimeout(() => {
        showNextWord();
    }, 1500);
}

function showFeedback(isCorrect, extra) {
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackClass = isCorrect ? 'alert-success' : 'alert-danger';
    let feedbackMessage = isCorrect ? 
        `✅ Correct! ${extra > 0 ? `Bonus punten: +${extra}` : ''}` : 
        `❌ Onjuist! Juiste antwoord: ${extra}`;
    
    if (streak > 2 && isCorrect) {
        feedbackMessage += ` 🔥 ${streak} woorden reeks!`;
    }
    
    feedbackContainer.innerHTML = `
        <div class="alert ${feedbackClass} mt-3">
            ${feedbackMessage}
        </div>
    `;
    
    setTimeout(() => {
        feedbackContainer.innerHTML = '';
    }, 1500);
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-learned').textContent = learnedWords.size;
}

function restartGame() {
    resetGame();
}

function playPronunciation(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'nl-NL';
    window.speechSynthesis.speak(utterance);
}

document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

initGame(); 