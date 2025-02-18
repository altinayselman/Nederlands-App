// Socket.io bağlantısı
const socket = io('http://localhost:3000');

// DOM elementleri
const joinScreen = document.getElementById('join-screen');
const waitingRoom = document.getElementById('waiting-room');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');

const createRoomBtn = document.querySelector('.create-room-btn');
const joinRoomBtn = document.querySelector('.join-room-btn');
const gameCodeInput = document.querySelector('.game-code-input');
const roomCodeDisplay = document.getElementById('room-code');
const copyCodeBtn = document.querySelector('.copy-code-btn');
const startGameBtn = document.querySelector('.start-game-btn');
const playAgainBtn = document.querySelector('.play-again-btn');
const returnHomeBtn = document.querySelector('.return-home-btn');

// Oyun durumu
let gameState = {
    roomCode: null,
    isHost: false,
    players: [],
    currentQuestion: 0,
    score: 0,
    timer: null
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    createRoomBtn.addEventListener('click', createRoom);
    joinRoomBtn.addEventListener('click', joinRoom);
    copyCodeBtn.addEventListener('click', copyRoomCode);
    startGameBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', restartGame);
    returnHomeBtn.addEventListener('click', returnToHome);
});

// Oyuncu adını al
function getPlayerName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.name : 'Speler ' + Math.floor(Math.random() * 1000);
}

// Oda oluşturma
function createRoom() {
    const playerName = getPlayerName();
    showLoadingState(createRoomBtn, 'Kamer maken...');

    socket.emit('createRoom', playerName);
}

// Socket event listeners
socket.on('roomCreated', (data) => {
    gameState.roomCode = data.code;
    gameState.isHost = true;
    gameState.players = data.players;

    roomCodeDisplay.textContent = data.code;
    showScreen('waiting-room');
    updatePlayersList();
    resetLoadingState(createRoomBtn);

    showNotification('Kamer succesvol aangemaakt!');
});

// Odaya katılma
function joinRoom() {
    const code = gameCodeInput.value.trim();
    if (!code) {
        showError('Voer een spelcode in');
        return;
    }

    const playerName = getPlayerName();
    showLoadingState(joinRoomBtn, 'Deelnemen...');

    socket.emit('joinRoom', {
        code: code,
        playerName: playerName
    });
}

socket.on('joinedRoom', (data) => {
    gameState.roomCode = data.code;
    gameState.isHost = false;
    gameState.players = data.players;

    showScreen('waiting-room');
    updatePlayersList();
    resetLoadingState(joinRoomBtn);

    showNotification('Succesvol toegetreden tot de kamer!');
});

socket.on('playerJoined', (player) => {
    gameState.players.push(player);
    updatePlayersList();
    showNotification(`${player.name} is toegetreden tot het spel!`);
});

socket.on('playerLeft', (playerId) => {
    gameState.players = gameState.players.filter(p => p.id !== playerId);
    updatePlayersList();
});

socket.on('joinError', (message) => {
    showError(message);
    resetLoadingState(joinRoomBtn);
});

socket.on('newHost', (player) => {
    gameState.isHost = player.id === socket.id;
    updatePlayersList();
    if (gameState.isHost) {
        showNotification('Je bent nu de host van het spel!');
        startGameBtn.disabled = false;
    }
});

// Oda kodunu kopyalama
function copyRoomCode() {
    navigator.clipboard.writeText(gameState.roomCode)
        .then(() => showNotification('Spelcode gekopieerd naar klembord!'))
        .catch(() => showError('Kon de spelcode niet kopiëren'));
}

// Oyun fonksiyonları
function startGame(gameData) {
    gameState.currentQuestion = 0;
    gameState.score = 0;
    updateGameUI(gameData);
}

function showQuestion(questionData) {
    const { question, options, timeLimit } = questionData;
    
    // Soru metnini güncelle
    document.getElementById('question-text').textContent = question;
    
    // Cevap seçeneklerini oluştur
    const answersGrid = document.querySelector('.answers-grid');
    answersGrid.innerHTML = '';
    
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        answersGrid.appendChild(button);
    });
    
    // Sayacı başlat
    startTimer(timeLimit);
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.answer-option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    
    socket.emit('submitAnswer', {
        roomCode: gameState.roomCode,
        answerIndex: index
    });
}

function showAnswerResult(result) {
    const options = document.querySelectorAll('.answer-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    options[result.correctIndex].classList.add('correct');
    if (result.yourIndex !== result.correctIndex) {
        options[result.yourIndex].classList.add('wrong');
    }
    
    updateScore(result.score);
}

function startTimer(duration) {
    const timerDisplay = document.getElementById('timer');
    let timeLeft = duration;
    
    clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        timerDisplay.textContent = timeLeft;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(gameState.timer);
            socket.emit('timeUp', gameState.roomCode);
        }
    }, 1000);
}

function showResults(results) {
    showScreen('results-screen');
    
    // Podyum gösterimi
    const podiumDisplay = document.querySelector('.podium-display');
    podiumDisplay.innerHTML = '';
    
    const topThree = results.slice(0, 3);
    topThree.forEach((player, index) => {
        const place = document.createElement('div');
        place.className = `podium-place ${['first', 'second', 'third'][index]}-place`;
        
        place.innerHTML = `
            <div class="podium-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="podium-name">${player.name}</div>
            <div class="podium-score">${player.score}</div>
            <div class="podium-block">${index + 1}</div>
        `;
        
        podiumDisplay.appendChild(place);
    });
    
    // Sonuç listesi
    const resultsList = document.querySelector('.results-list');
    resultsList.innerHTML = '';
    
    results.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'result-item';
        
        item.innerHTML = `
            <div class="result-player">
                <div class="result-rank">#${index + 1}</div>
                <div class="result-name">${player.name}</div>
            </div>
            <div class="result-stats">
                <div class="result-score">${player.score} puan</div>
                <div class="result-correct">${player.correctAnswers} doğru</div>
                <div class="result-time">${player.averageTime}s</div>
            </div>
        `;
        
        resultsList.appendChild(item);
    });
}

// Yardımcı fonksiyonlar
function showScreen(screen) {
    joinScreen.style.display = screen === 'join-screen' ? 'block' : 'none';
    waitingRoom.style.display = screen === 'waiting-room' ? 'block' : 'none';
    gameScreen.style.display = screen === 'game-screen' ? 'block' : 'none';
    resultsScreen.style.display = screen === 'results-screen' ? 'block' : 'none';
}

function updatePlayersList() {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = gameState.players.map(player => `
        <div class="player-card">
            <div class="player-avatar">
                <i class="fas fa-user"></i>
                ${player.isHost ? '<i class="fas fa-crown host-crown"></i>' : ''}
            </div>
            <div class="player-name">${player.name}</div>
        </div>
    `).join('');

    // Host kontrollerini güncelle
    startGameBtn.disabled = !gameState.isHost || gameState.players.length < 2;
}

function updateGameUI(gameData) {
    document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = gameData.totalQuestions;
}

function updateScore(newScore) {
    gameState.score = newScore;
    // Skor gösterimini güncelle
}

function showLoadingState(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

function resetLoadingState(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.innerHTML;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Butonların orijinal HTML'ini kaydet
    [createRoomBtn, joinRoomBtn, startGameBtn].forEach(btn => {
        btn.dataset.originalText = btn.innerHTML;
    });
    
    showScreen('join-screen');
}); 