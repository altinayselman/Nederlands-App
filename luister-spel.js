const audioExercises = {
    level1: {
        name: 'Niveau 1',
        sentences: [
            { text: "Hallo, hoe gaat het?", english: "Hello, how are you?" },
            { text: "Ik ben een student.", english: "I am a student." },
            { text: "Het weer is mooi vandaag.", english: "The weather is nice today." },
            { text: "Ik woon in Nederland.", english: "I live in the Netherlands." },
            { text: "Dit is mijn eerste les.", english: "This is my first lesson." }
        ]
    },
    level2: {
        name: 'Niveau 2',
        sentences: [
            { text: "Wat doe je in je vrije tijd?", english: "What do you do in your free time?" },
            { text: "Ik spreek een beetje Nederlands.", english: "I speak a little Dutch." },
            { text: "Kun je dat herhalen alsjeblieft?", english: "Can you repeat that please?" },
            { text: "Ik ga naar de supermarkt.", english: "I am going to the supermarket." },
            { text: "Het is half drie in de middag.", english: "It is half past two in the afternoon." }
        ]
    },
    level3: {
        name: 'Niveau 3',
        sentences: [
            { text: "Nederlands leren is heel interessant maar ook uitdagend.", english: "Learning Dutch is very interesting but also challenging." },
            { text: "Volgende week ga ik op vakantie naar Amsterdam.", english: "Next week I am going on vacation to Amsterdam." },
            { text: "Zou je me kunnen helpen met deze oefening?", english: "Could you help me with this exercise?" },
            { text: "De Nederlandse cultuur is heel verschillend van de mijne.", english: "Dutch culture is very different from mine." },
            { text: "Ik heb een afspraak met de dokter gemaakt.", english: "I made an appointment with the doctor." }
        ]
    }
};

let currentLevel = 'level1';
let currentSentenceIndex = 0;
let score = 0;
let playsLeft = 2;
let sentences = [];

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
                ${Object.entries(audioExercises).map(([key, level]) => 
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
    sentences = [...audioExercises[currentLevel].sentences];
    shuffleSentences();
    updateUI();
    resetPlayButton();
}

function shuffleSentences() {
    for (let i = sentences.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('current-level').textContent = currentLevel.replace('level', '');
    document.getElementById('plays-left').textContent = playsLeft;
    
    const progress = (currentSentenceIndex / sentences.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function resetPlayButton() {
    playsLeft = 2;
    document.getElementById('plays-left').textContent = playsLeft;
    document.getElementById('play-button').disabled = false;
}

function playCurrentSentence() {
    if (playsLeft > 0 && currentSentenceIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex].text);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.9; // Biraz yavaş konuşma hızı
        window.speechSynthesis.speak(utterance);
        
        playsLeft--;
        document.getElementById('plays-left').textContent = playsLeft;
        
        if (playsLeft === 0) {
            document.getElementById('play-button').disabled = true;
        }
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const currentSentence = sentences[currentSentenceIndex];
    
    if (userAnswer === currentSentence.text.toLowerCase()) {
        const points = calculatePoints();
        score += points;
        showFeedback(true, points);
    } else {
        showFeedback(false, currentSentence.text);
    }
    
    currentSentenceIndex++;
    updateUI();
    
    if (currentSentenceIndex < sentences.length) {
        setTimeout(() => {
            resetPlayButton();
            document.getElementById('answer').value = '';
            document.getElementById('answer').focus();
        }, 1500);
    } else {
        endGame();
    }
}

function calculatePoints() {
    const basePoints = {
        level1: 10,
        level2: 15,
        level3: 20
    };
    
    let points = basePoints[currentLevel];
    if (playsLeft > 0) points += playsLeft * 5; // Bonus for fewer plays
    return points;
}

function showFeedback(isCorrect, extra) {
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackClass = isCorrect ? 'alert-success' : 'alert-danger';
    let feedbackMessage = isCorrect ? 
        `✅ Correct! +${extra} punten` : 
        `❌ Onjuist! Juiste antwoord: "${extra}"`;
    
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
    document.getElementById('final-level').textContent = currentLevel.replace('level', '');
}

function restartGame() {
    // Oyun durumunu sıfırla
    currentSentenceIndex = 0;
    score = 0;
    playsLeft = 2;
    
    // Cümleleri yeniden karıştır
    sentences = [...audioExercises[currentLevel].sentences];
    shuffleSentences();
    
    // Arayüzü güncelle
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('score').textContent = '0';
    document.getElementById('current-level').textContent = currentLevel.replace('level', '');
    document.getElementById('plays-left').textContent = '2';
    document.getElementById('progress-bar').style.width = '0%';
    
    // İlk cümleyi göster
    showNextWord();
    
    // Play butonunu aktif hale getir
    document.getElementById('play-button').disabled = false;
    
    // Input alanını temizle
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

document.getElementById('play-button').addEventListener('click', playCurrentSentence);

document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

initGame(); 