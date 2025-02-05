const wordCategories = {
    basic: {
        name: 'Temel Kelimeler',
        words: [
            { dutch: "hallo", turkish: "merhaba" },
            { dutch: "dag", turkish: "günaydın" },
            { dutch: "doei", turkish: "hoşçakal" },
            { dutch: "ja", turkish: "evet" },
            { dutch: "nee", turkish: "hayır" },
            { dutch: "alsjeblieft", turkish: "lütfen" }
        ]
    },
    numbers: {
        name: 'Sayılar',
        words: [
            { dutch: "een", turkish: "bir" },
            { dutch: "twee", turkish: "iki" },
            { dutch: "drie", turkish: "üç" },
            { dutch: "vier", turkish: "dört" },
            { dutch: "vijf", turkish: "beş" },
            { dutch: "zes", turkish: "altı" }
        ]
    },
    colors: {
        name: 'Renkler',
        words: [
            { dutch: "rood", turkish: "kırmızı" },
            { dutch: "blauw", turkish: "mavi" },
            { dutch: "geel", turkish: "sarı" },
            { dutch: "groen", turkish: "yeşil" },
            { dutch: "zwart", turkish: "siyah" },
            { dutch: "wit", turkish: "beyaz" }
        ]
    }
};

let currentCategory = 'basic';
let currentWordIndex = 0;
let score = 0;
let words = [];
let attempts = 3;
let speechSynthesis = window.speechSynthesis;
let speaking = false;

function initGame() {
    createCategorySelector();
    resetGame();
}

function createCategorySelector() {
    const container = document.getElementById('category-container');
    container.innerHTML = `
        <div class="form-group">
            <label for="category-select" class="form-label">Kategori Seçin:</label>
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
    attempts = 3;
    words = [...wordCategories[currentCategory].words];
    shuffleWords();
    updateUI();
}

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    
    const progress = (currentWordIndex / words.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

function playWord() {
    if (speaking) return;
    
    if (attempts > 0) {
        const utterance = new SpeechSynthesisUtterance(words[currentWordIndex].dutch);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.8;
        
        utterance.onstart = () => {
            speaking = true;
            document.getElementById('listen-btn').disabled = true;
        };
        
        utterance.onend = () => {
            speaking = false;
            document.getElementById('listen-btn').disabled = false;
            attempts--;
            document.getElementById('attempts').textContent = attempts;
        };
        
        speechSynthesis.speak(utterance);
    } else {
        showFeedback(false, "Dinleme hakkınız kalmadı!");
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const correctAnswer = words[currentWordIndex].dutch.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        score += 10;
        showFeedback(true);
    } else {
        showFeedback(false, correctAnswer);
    }
    
    currentWordIndex++;
    attempts = 3;
    
    if (currentWordIndex < words.length) {
        setTimeout(() => {
            updateUI();
        }, 1500);
    } else {
        setTimeout(() => {
            endGame();
        }, 1500);
    }
}

function showFeedback(isCorrect, message = '') {
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackClass = isCorrect ? 'alert-success' : 'alert-danger';
    const feedbackMessage = isCorrect ? 
        '✅ Doğru!' : 
        `❌ Yanlış! Doğru kelime: ${message}`;
    
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
}

function restartGame() {
    resetGame();
}

// Enter tuşu ile cevap verme
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Oyunu başlat
initGame(); 