const matchingPairs = {
    level1: {
        name: 'Niveau 1 - Basis',
        pairs: [
            { icon: 'fas fa-home', word: 'huis', english: 'house' },
            { icon: 'fas fa-utensils', word: 'eten', english: 'food' },
            { icon: 'fas fa-bed', word: 'bed', english: 'bed' },
            { icon: 'fas fa-tshirt', word: 'kleding', english: 'clothing' },
            { icon: 'fas fa-car', word: 'auto', english: 'car' },
            { icon: 'fas fa-book', word: 'boek', english: 'book' }
        ]
    },
    level2: {
        name: 'Niveau 2 - Gemiddeld',
        pairs: [
            { icon: 'fas fa-hospital', word: 'ziekenhuis', english: 'hospital' },
            { icon: 'fas fa-shopping-cart', word: 'winkel', english: 'shop' },
            { icon: 'fas fa-plane', word: 'vliegtuig', english: 'airplane' },
            { icon: 'fas fa-train', word: 'trein', english: 'train' },
            { icon: 'fas fa-bicycle', word: 'fiets', english: 'bicycle' },
            { icon: 'fas fa-bus', word: 'bus', english: 'bus' }
        ]
    },
    level3: {
        name: 'Niveau 3 - Gevorderd',
        pairs: [
            { icon: 'fas fa-university', word: 'universiteit', english: 'university' },
            { icon: 'fas fa-briefcase', word: 'werk', english: 'work' },
            { icon: 'fas fa-graduation-cap', word: 'opleiding', english: 'education' },
            { icon: 'fas fa-laptop-code', word: 'computer', english: 'computer' },
            { icon: 'fas fa-paint-brush', word: 'kunst', english: 'art' },
            { icon: 'fas fa-music', word: 'muziek', english: 'music' }
        ]
    }
};

let currentLevel = 'level1';
let score = 0;
let matches = 0;
let timeLeft = 60;
let timer = null;
let cards = [];
let flippedCards = [];
let canFlip = true;

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
                ${Object.entries(matchingPairs).map(([key, level]) => 
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
    score = 0;
    matches = 0;
    timeLeft = 60;
    flippedCards = [];
    canFlip = true;
    clearInterval(timer);
    
    // Kartları hazırla
    const pairs = matchingPairs[currentLevel].pairs;
    cards = [];
    
    // İkon kartları
    pairs.forEach(pair => {
        cards.push({
            type: 'icon',
            content: pair.icon,
            match: pair.word,
            matched: false
        });
    });
    
    // Kelime kartları
    pairs.forEach(pair => {
        cards.push({
            type: 'word',
            content: pair.word,
            match: pair.word,
            matched: false
        });
    });
    
    // Kartları karıştır
    shuffleCards();
    
    // UI'ı güncelle
    updateUI();
    createCards();
    startTimer();
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('matches').textContent = matches;
    document.getElementById('timer').textContent = timeLeft;
    
    const progress = (matches / (cards.length / 2)) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function createCards() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = cards.map((card, index) => `
        <div class="match-card" data-index="${index}">
            <div class="match-card-inner">
                <div class="match-card-front">
                    <i class="fas fa-question"></i>
                </div>
                <div class="match-card-back">
                    ${card.type === 'icon' ? 
                        `<i class="${card.content}"></i>` : 
                        `<span>${card.content}</span>`}
                </div>
            </div>
        </div>
    `).join('');
    
    // Kart tıklama olaylarını ekle
    grid.querySelectorAll('.match-card').forEach(card => {
        card.addEventListener('click', () => flipCard(card));
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    const cardIndex = parseInt(card.dataset.index);
    flippedCards.push({ element: card, card: cards[cardIndex] });
    
    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.card.match === card2.card.match) {
        // Eşleşme başarılı
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matches++;
            score += 10;
            updateUI();
            
            if (matches === cards.length / 2) {
                endGame(true);
            }
            
            flippedCards = [];
            canFlip = true;
        }, 500);
    } else {
        // Eşleşme başarısız
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(timer);
    
    if (won) {
        score += timeLeft * 2; // Kalan süre için bonus puan
    }
    
    document.getElementById('game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-matches').textContent = matches;
}

function restartGame() {
    resetGame();
}

// Oyunu başlat
initGame(); 