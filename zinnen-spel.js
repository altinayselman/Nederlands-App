const sentenceExercises = {
    level1: {
        name: 'Niveau 1',
        sentences: [
            {
                words: ['ik', 'ben', 'student', 'een'],
                correct: 'ik ben een student',
                english: 'I am a student'
            },
            {
                words: ['hij', 'naar', 'school', 'gaat'],
                correct: 'hij gaat naar school',
                english: 'He goes to school'
            },
            {
                words: ['wij', 'in', 'Nederland', 'wonen'],
                correct: 'wij wonen in nederland',
                english: 'We live in the Netherlands'
            },
            {
                words: ['zij', 'spreekt', 'Nederlands', 'goed'],
                correct: 'zij spreekt goed nederlands',
                english: 'She speaks Dutch well'
            }
        ]
    },
    level2: {
        name: 'Niveau 2',
        sentences: [
            {
                words: ['ik', 'ga', 'morgen', 'naar', 'de', 'bibliotheek'],
                correct: 'ik ga morgen naar de bibliotheek',
                english: 'I am going to the library tomorrow'
            },
            {
                words: ['hij', 'heeft', 'een', 'nieuwe', 'auto', 'gekocht'],
                correct: 'hij heeft een nieuwe auto gekocht',
                english: 'He bought a new car'
            },
            {
                words: ['wij', 'willen', 'graag', 'Nederlands', 'leren'],
                correct: 'wij willen graag nederlands leren',
                english: 'We would like to learn Dutch'
            },
            {
                words: ['zij', 'werkt', 'in', 'een', 'groot', 'bedrijf'],
                correct: 'zij werkt in een groot bedrijf',
                english: 'She works in a big company'
            }
        ]
    },
    level3: {
        name: 'Niveau 3',
        sentences: [
            {
                words: ['ik', 'heb', 'gisteren', 'mijn', 'huiswerk', 'niet', 'kunnen', 'maken'],
                correct: 'ik heb gisteren mijn huiswerk niet kunnen maken',
                english: 'I could not do my homework yesterday'
            },
            {
                words: ['hij', 'zal', 'volgende', 'week', 'naar', 'Amsterdam', 'verhuizen'],
                correct: 'hij zal volgende week naar amsterdam verhuizen',
                english: 'He will move to Amsterdam next week'
            },
            {
                words: ['wij', 'hebben', 'het', 'weekend', 'in', 'Parijs', 'doorgebracht'],
                correct: 'wij hebben het weekend in parijs doorgebracht',
                english: 'We spent the weekend in Paris'
            },
            {
                words: ['zij', 'moet', 'vandaag', 'vroeg', 'naar', 'haar', 'werk', 'gaan'],
                correct: 'zij moet vandaag vroeg naar haar werk gaan',
                english: 'She has to go to work early today'
            }
        ]
    }
};

let currentLevel = 'level1';
let currentSentenceIndex = 0;
let score = 0;
let correctCount = 0;
let sentences = [];
let selectedWords = [];

function initGame() {
    createLevelSelector();
    resetGame();
}

function createLevelSelector() {
    const container = document.getElementById('level-container');
    container.innerHTML = `
        <div class="form-group">
            <label for="level-select" class="form-label">Kies een niveau:</label>
            <select class="form-select" id="level-select" onchange="changeLevel(this.value)">
                ${Object.entries(sentenceExercises).map(([key, level]) => 
                    `<option value="${key}">${level.name}</option>`
                ).join('')}
            </select>
        </div>
    `;
}

function changeLevel(newLevel) {
    currentLevel = newLevel;
    resetGame();
}

function resetGame() {
    currentSentenceIndex = 0;
    score = 0;
    correctCount = 0;
    sentences = [...sentenceExercises[currentLevel].sentences];
    shuffleSentences();
    selectedWords = [];
    updateUI();
    showNextSentence();
}

function shuffleSentences() {
    for (let i = sentences.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct-count').textContent = correctCount;
    
    const progress = (currentSentenceIndex / sentences.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function showNextSentence() {
    if (currentSentenceIndex < sentences.length) {
        const currentSentence = sentences[currentSentenceIndex];
        selectedWords = [];
        
        // Shuffle words for word bank
        const shuffledWords = [...currentSentence.words];
        for (let i = shuffledWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
        }
        
        // Update word bank
        const wordBank = document.getElementById('word-bank');
        wordBank.innerHTML = shuffledWords.map(word => 
            `<button class="btn btn-outline-primary m-1" onclick="selectWord('${word}')">${word}</button>`
        ).join('');
        
        // Clear sentence builder
        updateSentenceBuilder();
    } else {
        endGame();
    }
}

function selectWord(word) {
    const wordButtons = document.getElementById('word-bank').getElementsByTagName('button');
    for (let button of wordButtons) {
        if (button.textContent === word && !button.disabled) {
            button.disabled = true;
            selectedWords.push(word);
            updateSentenceBuilder();
            break;
        }
    }
}

function removeWord(index) {
    const word = selectedWords[index];
    selectedWords.splice(index, 1);
    
    const wordButtons = document.getElementById('word-bank').getElementsByTagName('button');
    for (let button of wordButtons) {
        if (button.textContent === word) {
            button.disabled = false;
            break;
        }
    }
    
    updateSentenceBuilder();
}

function updateSentenceBuilder() {
    const builder = document.getElementById('sentence-builder');
    if (selectedWords.length === 0) {
        builder.innerHTML = '<div class="empty-builder">Klik op woorden om een zin te maken</div>';
    } else {
        builder.innerHTML = selectedWords.map((word, index) => 
            `<button class="btn btn-primary m-1" onclick="removeWord(${index})">${word}</button>`
        ).join('');
    }
}

function resetSentence() {
    selectedWords = [];
    const wordButtons = document.getElementById('word-bank').getElementsByTagName('button');
    for (let button of wordButtons) {
        button.disabled = false;
    }
    updateSentenceBuilder();
}

function checkSentence() {
    const userSentence = selectedWords.join(' ').toLowerCase();
    const currentSentence = sentences[currentSentenceIndex];
    
    if (userSentence === currentSentence.correct) {
        const points = calculatePoints();
        score += points;
        correctCount++;
        showFeedback(true, currentSentence.english);
    } else {
        showFeedback(false, currentSentence.correct);
    }
    
    currentSentenceIndex++;
    setTimeout(() => {
        showNextSentence();
    }, 2000);
}

function calculatePoints() {
    const basePoints = {
        level1: 10,
        level2: 15,
        level3: 20
    };
    return basePoints[currentLevel];
}

function showFeedback(isCorrect, message) {
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackClass = isCorrect ? 'alert-success' : 'alert-danger';
    let feedbackMessage = isCorrect ? 
        `✅ Correct! +${calculatePoints()} punten<br><small class="text-muted">${message}</small>` : 
        `❌ Onjuist! Juiste zin:<br>"${message}"`;
    
    feedbackContainer.innerHTML = `
        <div class="alert ${feedbackClass} mt-3">
            ${feedbackMessage}
        </div>
    `;
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-correct').textContent = correctCount;
}

initGame(); 