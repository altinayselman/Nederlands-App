// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyDcD2vS6Vyeh5Pog3LfwoJiqU-lqoc1Z08",
    authDomain: "leer-nederlands-a80fa.firebaseapp.com",
    databaseURL: "https://leer-nederlands-a80fa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "leer-nederlands-a80fa",
    storageBucket: "leer-nederlands-a80fa.firebasestorage.app",
    messagingSenderId: "161317498371",
    appId: "1:161317498371:web:8c8d20b0c5dede2394a836",
    measurementId: "G-BGE19RGMKP"
};

// Firebase'i başlat
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// PeerJS bağlantısı
let peer = null;
let connections = [];
let gameState = {
    roomCode: null,
    isHost: false,
    players: {},
    currentQuestion: 0,
    score: 0,
    playerName: null,
    pendingAction: null,
    settings: {
        difficulty: 'beginner',
        questionCount: 10,
        timeLimit: 20
    }
};

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

// İsim Modal
const nameModal = new bootstrap.Modal(document.getElementById('nameModal'));
const playerNameInput = document.getElementById('playerName');
const confirmNameBtn = document.getElementById('confirmName');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializePeer();
    loadActiveRooms();
    showScreen('join-screen');
});

function initializePeer() {
    peer = new Peer(null, {
        debug: 2,
        config: {
            'iceServers': [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        }
    });

    peer.on('open', (id) => {
        console.log('Bağlantı ID:', id);
        if (gameState.pendingAction === 'create') {
            createRoom();
        } else if (gameState.pendingAction === 'join') {
            joinRoom(gameCodeInput.value.trim());
        }
    });

    peer.on('connection', handleConnection);
    
    peer.on('error', (err) => {
        console.error('PeerJS Hatası:', err);
        showError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
        resetLoadingState(createRoomBtn);
        resetLoadingState(joinRoomBtn);
    });
}

function setupEventListeners() {
    // Oda oluşturma butonu
    document.querySelector('.create-room-btn').addEventListener('click', () => {
        showNameModal('create');
    });

    // Odaya katılma butonu
    document.querySelector('.join-room-btn').addEventListener('click', () => {
        const code = document.querySelector('.game-code-input').value.trim();
        if (code) {
            showNameModal('join');
        } else {
            showError('Voer een spelcode in');
        }
    });

    // İsim onaylama butonu
    document.getElementById('confirmName').addEventListener('click', handleNameConfirm);

    // Enter tuşu ile isim onaylama
    document.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleNameConfirm();
        }
    });

    // Butonların orijinal HTML'ini kaydet
    [createRoomBtn, joinRoomBtn, startGameBtn].forEach(btn => {
        if (btn) btn.dataset.originalText = btn.innerHTML;
    });

    document.querySelector('.leave-room-btn').addEventListener('click', leaveRoom);
    startGameBtn?.addEventListener('click', startGame);
}

// Aktif odaları yükle
function loadActiveRooms() {
    const roomsRef = database.ref('rooms');
    roomsRef.on('value', (snapshot) => {
        const rooms = snapshot.val() || {};
        updateActiveRoomsList(rooms);
    });
}

// Aktif odalar listesini güncelle
function updateActiveRoomsList(rooms) {
    const container = document.getElementById('active-rooms-container');
    container.innerHTML = '';

    Object.entries(rooms).forEach(([code, room]) => {
        if (room.status === 'waiting') {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <div class="room-info">
                    <h4><i class="fas fa-users"></i> ${Object.keys(room.players).length} Spelers</h4>
                    <p>Host: ${Object.values(room.players).find(p => p.isHost)?.name || 'Onbekend'}</p>
                    <p><small>Alleen toegankelijk met code</small></p>
                </div>
            `;
            container.appendChild(roomCard);
        }
    });
}

// Oda oluştur
async function createRoom() {
    try {
        showLoadingState(createRoomBtn, 'Kamer maken...');
        
        // Oyuncu adını al
        const playerName = await getPlayerName();
        if (!playerName) {
            resetLoadingState(createRoomBtn);
            return;
        }

        // Oda kodunu oluştur
        const roomCode = generateRoomCode();
        gameState.roomCode = roomCode;
        
        // Oda verilerini hazırla
        const roomData = {
            code: roomCode,
            host: generatePlayerId(),
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            status: 'waiting',
            players: {
                [generatePlayerId()]: {
                    name: playerName,
                    isHost: true,
                    score: 0
                }
            },
            settings: gameState.settings
        };

        // Odayı veritabanına kaydet
        await database.ref('rooms/' + roomCode).set(roomData);

        // Oyun durumunu güncelle
        gameState.isHost = true;
        gameState.playerName = playerName;

        // Oda değişikliklerini dinle
        listenToRoomChanges(roomCode);

        // Bekleme odasını göster
        showScreen('waiting-room');
        updatePlayersList();

        console.log('Oda başarıyla oluşturuldu:', roomCode);
    } catch (error) {
        console.error('Oda oluşturma hatası:', error);
        showError('Er is een fout opgetreden bij het maken van de kamer. Probeer het opnieuw.');
    } finally {
        resetLoadingState(createRoomBtn);
    }
}

// Odaya katıl
function joinRoom(code) {
    const roomRef = database.ref(`rooms/${code}`);
    
    roomRef.once('value')
        .then((snapshot) => {
            const room = snapshot.val();
            if (!room) {
                showError('Kamer niet gevonden');
                return;
            }
            if (room.status !== 'waiting') {
                showError('Dit spel is al begonnen');
                return;
            }
            if (Object.keys(room.players || {}).length >= 8) {
                showError('Kamer is vol');
                return;
            }

            const playerId = generatePlayerId();
            const newPlayer = {
                name: gameState.playerName,
                isHost: false,
                score: 0
            };

            const updates = {};
            updates[`rooms/${code}/players/${playerId}`] = newPlayer;

            database.ref().update(updates)
                .then(() => {
                    gameState.roomCode = code;
                    gameState.isHost = false;
                    showScreen('waiting-room');
                    roomCodeDisplay.textContent = code;
                    listenToRoomChanges(code);
                    showNotification('Succesvol toegetreden tot de kamer!');
                })
                .catch(error => {
                    console.error('Deelnemen mislukt:', error);
                    showError('Er is een fout opgetreden bij het deelnemen aan de kamer');
                });
        })
        .catch(error => {
            console.error('Kamer controle mislukt:', error);
            showError('Er is een fout opgetreden bij het controleren van de kamer');
        });
}

// Hızlı katılım
function quickJoin(code) {
    if (!gameState.playerName) {
        showNameModal('join');
        gameCodeInput.value = code;
    } else {
        joinRoom(code);
    }
}

// Oda değişikliklerini dinle
function listenToRoomChanges(roomCode) {
    const roomRef = database.ref(`rooms/${roomCode}`);
    
    roomRef.on('value', (snapshot) => {
        const room = snapshot.val();
        if (!room) {
            showError('Oda kapandı');
            showScreen('join-screen');
            return;
        }

        gameState.players = room.players;
        updatePlayersList();

        // Oyun başladıysa tüm oyuncuları oyun ekranına yönlendir
        if (room.status === 'playing' && room.gameStarted) {
            showScreen('game-screen');
            showQuestion(room.currentQuestion);
            startGameTimer(gameState.settings.timeLimit);
        }
    });
}

// Odadan ayrıl
function leaveRoom() {
    if (gameState.roomCode) {
        const roomRef = database.ref(`rooms/${gameState.roomCode}`);
        
        if (gameState.isHost) {
            // Host odayı tamamen siliyor
            roomRef.remove()
                .then(() => {
                    showNotification('Oda başarıyla kapatıldı');
                })
                .catch(error => {
                    console.error('Oda silme hatası:', error);
                    showError('Oda kapatılırken bir hata oluştu');
                });
        } else {
            // Diğer oyuncular sadece kendilerini kaldırıyor
            const playerId = Object.keys(gameState.players).find(id => 
                gameState.players[id].name === gameState.playerName
            );
            
            if (playerId) {
                roomRef.child(`players/${playerId}`).remove()
                    .then(() => {
                        showNotification('Odadan ayrıldınız');
                    })
                    .catch(error => {
                        console.error('Oyuncu silme hatası:', error);
                        showError('Odadan ayrılırken bir hata oluştu');
                    });
            }
        }

        // Bağlantıları kapat
        connections.forEach(conn => conn.close());
        connections = [];

        // Oyun durumunu sıfırla
        gameState = {
            roomCode: null,
            isHost: false,
            players: {},
            currentQuestion: 0,
            score: 0,
            playerName: gameState.playerName,
            pendingAction: null,
            settings: {
                difficulty: 'beginner',
                questionCount: 10,
                timeLimit: 20
            }
        };

        // Ana ekrana dön
        showScreen('join-screen');
    }
}

// Oyunu başlat
function startGame() {
    if (!gameState.isHost) return;

    const roomRef = database.ref(`rooms/${gameState.roomCode}`);
    const firstQuestion = generateQuestion();
    
    roomRef.update({
        status: 'playing',
        currentQuestion: firstQuestion,
        startTime: firebase.database.ServerValue.TIMESTAMP,
        gameStarted: true,
        scores: {}
    }).then(() => {
        // Tüm oyunculara oyunun başladığını bildir
        broadcastGameState();
        showScreen('game-screen');
        startGameTimer(gameState.settings.timeLimit);
        showQuestion(firstQuestion);
    });
}

// Bağlantı yönetimi
function handleConnection(conn) {
    console.log('Yeni bağlantı yönetiliyor:', conn.peer);
    connections.push(conn);

    conn.on('open', () => {
        console.log('Bağlantı açıldı:', conn.peer);
        
        // Eğer bu host ise, mevcut oyun durumunu gönder
        if (gameState.isHost) {
            conn.send({
                type: 'gameState',
                state: gameState
            });
        }
    });

    conn.on('data', (data) => {
        console.log('Veri alındı:', data);
        handleGameData(data, conn);
    });

    conn.on('close', () => {
        console.log('Bağlantı kapandı:', conn.peer);
        handlePlayerDisconnect(conn);
    });

    conn.on('error', (err) => {
        console.error('Bağlantı hatası:', err);
        showError('Er is een verbindingsfout opgetreden');
    });
}

// Oyun verisi işleme
function handleGameData(data, conn) {
    switch (data.type) {
        case 'join':
            if (gameState.isHost) {
                gameState.players.push(data.player);
                broadcastGameState();
                updatePlayersList();
                showNotification(`${data.player.name} is toegetreden tot het spel!`);
            }
            break;
            
        case 'gameState':
            gameState = data.state;
            updatePlayersList();
            if (data.state.started) {
                showScreen('game-screen');
                showQuestion(data.state.currentQuestion);
            }
            break;
            
        case 'answer':
            if (gameState.isHost) {
                handlePlayerAnswer(data);
            }
            break;
    }
}

// Oyuncu ayrılma işlemi
function handlePlayerDisconnect(conn) {
    const index = connections.indexOf(conn);
    if (index > -1) {
        connections.splice(index, 1);
    }

    if (gameState.players && gameState.players[conn.peer]) {
        const playerName = gameState.players[conn.peer].name;
        delete gameState.players[conn.peer];
        showNotification(`${playerName} heeft het spel verlaten`);
        updatePlayersList();
        
        if (Object.keys(gameState.players).length < 2) {
            startGameBtn.disabled = true;
        }
    }
}

// Oyun durumunu yayınlama
function broadcastGameState() {
    const gameData = {
        type: 'gameState',
        state: gameState
    };
    
    connections.forEach(conn => {
        if (conn.open) {
            conn.send(gameData);
        }
    });
}

// Yardımcı fonksiyonlar
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generatePlayerId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getPlayerName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.name) {
        return currentUser.name;
    }
    showError('Lütfen önce giriş yapın');
    return null;
}

function copyRoomCode() {
    navigator.clipboard.writeText(gameState.roomCode)
        .then(() => showNotification('Spelcode gekopieerd naar klembord!'))
        .catch(() => showError('Kon de spelcode niet kopiëren'));
}

function showScreen(screen) {
    joinScreen.style.display = screen === 'join-screen' ? 'block' : 'none';
    waitingRoom.style.display = screen === 'waiting-room' ? 'block' : 'none';
    gameScreen.style.display = screen === 'game-screen' ? 'block' : 'none';
    resultsScreen.style.display = screen === 'results-screen' ? 'block' : 'none';

    if (screen === 'waiting-room') {
        roomCodeDisplay.textContent = gameState.roomCode;
    }
}

function updatePlayersList() {
    const container = document.getElementById('players-container');
    if (!container || !gameState.players) return;

    const playerArray = Object.entries(gameState.players).map(([id, player]) => ({
        id,
        ...player
    }));

    container.innerHTML = playerArray.map(player => `
        <div class="player-card">
            <div class="player-avatar">
                <i class="fas fa-user"></i>
                ${player.isHost ? '<i class="fas fa-crown host-crown"></i>' : ''}
            </div>
            <div class="player-name">${player.name}</div>
            ${player.isHost ? `<div class="room-code">Kamer Code: ${gameState.roomCode}</div>` : ''}
        </div>
    `).join('');

    // Start butonu kontrolü - en az 2 oyuncu varsa aktif olsun
    if (gameState.isHost && startGameBtn) {
        startGameBtn.disabled = playerArray.length < 2;
        if (startGameBtn.disabled) {
            startGameBtn.title = 'Er zijn minimaal 2 spelers nodig om het spel te starten';
        } else {
            startGameBtn.title = 'Start het spel';
        }
    }
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

// Soru gösterme
function showQuestion(question) {
    document.getElementById('question-text').textContent = question.text;
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = question.options.map((option, index) => `
        <button class="answer-option" onclick="selectAnswer(${index})">
            ${option}
        </button>
    `).join('');
}

// Soru oluşturma
function generateQuestion() {
    const questions = [
        {
            text: "Wat betekent 'huis' in het Engels?",
            options: ["House", "Car", "Tree", "Book"],
            correct: 0
        },
        {
            text: "Wat betekent 'kat' in het Engels?",
            options: ["Dog", "Cat", "Bird", "Fish"],
            correct: 1
        },
        // Daha fazla soru eklenebilir
    ];
    return questions[Math.floor(Math.random() * questions.length)];
}

// Cevap seçme
function selectAnswer(index) {
    if (!gameState.started) return;
    
    const answerData = {
        type: 'answer',
        playerId: peer.id,
        answerIndex: index
    };
    
    if (gameState.isHost) {
        handlePlayerAnswer(answerData);
    } else {
        connections[0].send(answerData);
    }
    
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.disabled = true;
    });
}

// Cevap kontrolü ve puanlama
function handlePlayerAnswer(data) {
    const currentTime = Date.now();
    const responseTime = currentTime - gameState.questionStartTime;
    const correct = data.answerIndex === gameState.currentQuestion.correct;
    
    // Hızlı cevap verme puanı (maksimum 10 puan)
    let timeBonus = correct ? Math.max(0, Math.floor((5000 - responseTime) / 500)) : 0;
    let points = correct ? (10 + timeBonus) : 0;

    // Oyuncunun puanını güncelle
    const playerRef = database.ref(`rooms/${gameState.roomCode}/players/${data.playerId}`);
    playerRef.update({
        score: firebase.database.ServerValue.increment(points)
    });

    // Skor tablosunu güncelle
    updateScoreboard();
    broadcastGameState();
}

// Skor tablosunu güncelle
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    if (!scoreboard || !gameState.players) return;

    const players = Object.entries(gameState.players)
        .map(([id, player]) => ({
            id,
            name: player.name,
            score: player.score || 0
        }))
        .sort((a, b) => b.score - a.score);

    scoreboard.innerHTML = players.map(player => `
        <div class="score-entry ${player.id === peer.id ? 'current-player' : ''}">
            <span class="player-name">${player.name}</span>
            <span class="player-score">${player.score} puan</span>
        </div>
    `).join('');
}

// Oyun zamanlayıcısı
function startGameTimer(duration) {
    const timerDisplay = document.getElementById('timer');
    gameState.questionStartTime = Date.now();
    
    let timeLeft = duration;
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Süre dolduğunda sonraki soruya geç
            nextQuestion();
        } else {
            timerDisplay.textContent = timeLeft;
            timeLeft--;
        }
    }, 1000);
}

// Sonraki soru
function nextQuestion() {
    if (!gameState.isHost) return;
    
    const newQuestion = generateQuestion();
    const roomRef = database.ref(`rooms/${gameState.roomCode}`);
    
    roomRef.update({
        currentQuestion: newQuestion,
        questionStartTime: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        broadcastGameState();
        showQuestion(newQuestion);
        startGameTimer(gameState.settings.timeLimit);
    });
}

// Oyun fonksiyonları
function showAnswerResult(result) {
    const options = document.querySelectorAll('.answer-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    options[result.correctIndex].classList.add('correct');
    if (result.yourIndex !== result.correctIndex) {
        options[result.yourIndex].classList.add('wrong');
    }
    
    updateScore(result.score);
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

function updateScore(newScore) {
    gameState.score = newScore;
    // Skor gösterimini güncelle
}

// İsim modalını göster
function showNameModal(action) {
    gameState.pendingAction = action;
    nameModal.show();
    playerNameInput.focus();
}

// İsim onaylama
function handleNameConfirm() {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        showError('Voer een naam in');
        return;
    }

    try {
        gameState.playerName = playerName;
        const nameModalElement = document.getElementById('nameModal');
        const nameModalInstance = bootstrap.Modal.getInstance(nameModalElement);
        nameModalInstance.hide();

        console.log('İşlem:', gameState.pendingAction);
        console.log('Oyuncu adı:', gameState.playerName);

        if (gameState.pendingAction === 'create') {
            createRoom();
        } else if (gameState.pendingAction === 'join') {
            const code = document.querySelector('.game-code-input').value.trim();
            joinRoom(code);
        }
    } catch (error) {
        console.error('Modal kapatma hatası:', error);
        showError('Er is een fout opgetreden. Probeer het opnieuw.');
    }
} 