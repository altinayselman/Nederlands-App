const sentences = [
    {
        dutch: "Ik ga naar huis",
        turkish: "Eve gidiyorum",
        words: ["Eve", "gidiyorum"]
    },
    {
        dutch: "Ik hou van jou",
        turkish: "Seni seviyorum",
        words: ["Seni", "seviyorum"]
    },
    {
        dutch: "Het weer is mooi",
        turkish: "Hava güzel",
        words: ["Hava", "güzel"]
    },
    {
        dutch: "Ik drink water",
        turkish: "Su içiyorum",
        words: ["Su", "içiyorum"]
    },
    {
        dutch: "De kat slaapt",
        turkish: "Kedi uyuyor",
        words: ["Kedi", "uyuyor"]
    }
];

let currentSentenceIndex = 0;
let score = 0;
let selectedWords = [];

function initGame() {
    currentSentenceIndex = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    showNextSentence();
}

function showNextSentence() {
    if (currentSentenceIndex < sentences.length) {
        const currentSentence = sentences[currentSentenceIndex];
        document.getElementById('sentence-display').textContent = currentSentence.dutch;
        
        // Kelimeleri karıştır ve göster
        const shuffledWords = [...currentSentence.words].sort(() => Math.random() - 0.5);
        const wordsContainer = document.getElementById('words-container');
        wordsContainer.innerHTML = '';
        
        shuffledWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-card';
            wordElement.textContent = word;
            wordElement.onclick = () => selectWord(word);
            wordsContainer.appendChild(wordElement);
        });

        // Cevap alanını temizle
        selectedWords = [];
        updateAnswerDisplay();
    } else {
        endGame();
    }
}

function selectWord(word) {
    if (!selectedWords.includes(word)) {
        selectedWords.push(word);
        updateAnswerDisplay();
    }
}

function updateAnswerDisplay() {
    const answerBox = document.getElementById('answer-box');
    answerBox.innerHTML = '';
    selectedWords.forEach((word, index) => {
        const wordElement = document.createElement('span');
        wordElement.className = 'selected-word';
        wordElement.textContent = word;
        wordElement.onclick = () => removeWord(index);
        answerBox.appendChild(wordElement);
    });
}

function removeWord(index) {
    selectedWords.splice(index, 1);
    updateAnswerDisplay();
}

function checkSentence() {
    const currentSentence = sentences[currentSentenceIndex];
    const userAnswer = selectedWords.join(' ');
    
    if (userAnswer === currentSentence.turkish) {
        score += 20;
        document.getElementById('score').textContent = score;
    }
    
    currentSentenceIndex++;
    showNextSentence();
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