const wordCategories = {
    beginner: {
        name: 'Beginnersniveau',
        words: [
            { dutch: "hallo", english: "hello", image: "images/hello.png", points: 5 },
            { dutch: "dag", english: "good day", image: "images/goodday.png", points: 5 },
            { dutch: "doei", english: "goodbye", image: "images/goodbye.png", points: 5 },
            { dutch: "ja", english: "yes", image: "images/yes.png", points: 5 },
            { dutch: "nee", english: "no", image: "images/no.png", points: 5 },
            { dutch: "dank je wel", english: "thank you", image: "images/thankyou.png", points: 5 },
            { dutch: "alsjeblieft", english: "please", image: "images/please.png", points: 5 },
            { dutch: "goedemorgen", english: "good morning", image: "images/goodmorning.png", points: 5 },
            { dutch: "goedemiddag", english: "good afternoon", image: "images/goodafternoon.png", points: 5 },
            { dutch: "goedenavond", english: "good evening", image: "images/goodevening.png", points: 5 }
        ]
    },
    intermediate: {
        name: 'Middenniveau',
        words: [
            { dutch: "computer", english: "computer", image: "images/computer.png", points: 10 },
            { dutch: "telefoon", english: "phone", image: "images/phone.png", points: 10 },
            { dutch: "boek", english: "book", image: "images/book.png", points: 10 },
            { dutch: "tafel", english: "table", image: "images/table.png", points: 10 },
            { dutch: "stoel", english: "chair", image: "images/chair.png", points: 10 },
            { dutch: "huis", english: "house", image: "images/house.png", points: 10 },
            { dutch: "school", english: "school", image: "images/school.png", points: 10 },
            { dutch: "werk", english: "work", image: "images/work.png", points: 10 },
            { dutch: "eten", english: "food", image: "images/food.png", points: 10 },
            { dutch: "drinken", english: "drink", image: "images/drink.png", points: 10 }
        ]
    },
    advanced: {
        name: 'Gevorderd niveau',
        words: [
            { dutch: "verantwoordelijkheid", english: "responsibility", image: "images/responsibility.png", points: 15 },
            { dutch: "gebeurtenis", english: "event", image: "images/event.png", points: 15 },
            { dutch: "ontwikkeling", english: "development", image: "images/development.png", points: 15 },
            { dutch: "belangrijk", english: "important", image: "images/important.png", points: 15 },
            { dutch: "ervaring", english: "experience", image: "images/experience.png", points: 15 },
            { dutch: "samenwerking", english: "collaboration", image: "images/collaboration.png", points: 15 },
            { dutch: "mogelijkheid", english: "possibility", image: "images/possibility.png", points: 15 },
            { dutch: "onderzoek", english: "research", image: "images/research.png", points: 15 },
            { dutch: "maatschappij", english: "society", image: "images/society.png", points: 15 },
            { dutch: "wetenschap", english: "science", image: "images/science.png", points: 15 }
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
                <img src="${currentWord.image}" alt="${currentWord.dutch}" class="word-image">
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

// Enter tuşu ile cevap verme
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Oyunu başlat
initGame(); 