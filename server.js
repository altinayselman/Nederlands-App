const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static('public'));

// Aktif odaları saklamak için
const rooms = new Map();

// Rastgele oda kodu oluşturma
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on('connection', (socket) => {
    console.log('Nieuwe verbinding:', socket.id);

    // Oda oluşturma
    socket.on('createRoom', (playerName) => {
        try {
            const roomCode = generateRoomCode();
            const room = {
                code: roomCode,
                host: socket.id,
                players: [{
                    id: socket.id,
                    name: playerName || `Speler ${socket.id.substr(0, 4)}`,
                    isHost: true,
                    score: 0
                }],
                status: 'waiting'
            };
            
            rooms.set(roomCode, room);
            socket.join(roomCode);
            
            socket.emit('roomCreated', {
                code: roomCode,
                players: room.players
            });
            
            console.log(`Kamer aangemaakt: ${roomCode}`);
        } catch (error) {
            console.error('Fout bij het maken van de kamer:', error);
            socket.emit('joinError', 'Er is een fout opgetreden bij het maken van de kamer');
        }
    });

    // Odaya katılma
    socket.on('joinRoom', ({ code, playerName }) => {
        try {
            code = code.toUpperCase();
            if (!rooms.has(code)) {
                socket.emit('joinError', 'Kamer niet gevonden');
                return;
            }

            const room = rooms.get(code);
            
            if (room.status !== 'waiting') {
                socket.emit('joinError', 'Spel is al begonnen');
                return;
            }
            
            if (room.players.length >= 8) {
                socket.emit('joinError', 'Kamer is vol');
                return;
            }
            
            const player = {
                id: socket.id,
                name: playerName || `Speler ${socket.id.substr(0, 4)}`,
                isHost: false,
                score: 0
            };
            
            room.players.push(player);
            socket.join(code);
            
            socket.emit('joinedRoom', {
                code: code,
                players: room.players
            });
            
            socket.to(code).emit('playerJoined', player);
            
            console.log(`${player.name} is toegetreden tot kamer: ${code}`);
        } catch (error) {
            console.error('Fout bij het toetreden tot de kamer:', error);
            socket.emit('joinError', 'Er is een fout opgetreden bij het toetreden tot de kamer');
        }
    });

    // Oyuncunun ayrılması
    socket.on('disconnect', () => {
        try {
            rooms.forEach((room, code) => {
                const playerIndex = room.players.findIndex(p => p.id === socket.id);
                if (playerIndex !== -1) {
                    const player = room.players[playerIndex];
                    room.players.splice(playerIndex, 1);
                    
                    socket.to(code).emit('playerLeft', socket.id);
                    
                    if (room.players.length === 0) {
                        rooms.delete(code);
                        console.log(`Kamer verwijderd: ${code}`);
                    } else if (player.isHost) {
                        const newHost = room.players[0];
                        newHost.isHost = true;
                        room.host = newHost.id;
                        io.to(code).emit('newHost', newHost);
                        console.log(`Nieuwe host in kamer ${code}: ${newHost.name}`);
                    }
                    
                    console.log(`${player.name} heeft kamer verlaten: ${code}`);
                }
            });
        } catch (error) {
            console.error('Fout bij het verwerken van disconnect:', error);
        }
    });

    // Oyunu başlatma
    socket.on('startGame', ({ roomCode, settings }) => {
        try {
            const room = rooms.get(roomCode);
            if (room && room.host === socket.id) {
                room.status = 'playing';
                io.to(roomCode).emit('gameStarted', {
                    settings,
                    players: room.players
                });
                console.log(`Spel gestart in kamer: ${roomCode}`);
            }
        } catch (error) {
            console.error('Fout bij het starten van het spel:', error);
            socket.emit('error', 'Er is een fout opgetreden bij het starten van het spel');
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
}); 