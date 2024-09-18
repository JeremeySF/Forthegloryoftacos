const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let lobbies = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A player connected');

  // Create lobby
  socket.on('createLobby', () => {
    let code = generateGameCode();
    lobbies[code] = { players: [] };
    socket.join(code);
    lobbies[code].players.push(socket.id);
    socket.emit('startGame', { mapData: generateRandomMap() });
  });

  // Join lobby
  socket.on('joinGame', (code) => {
    if (lobbies[code]) {
      socket.join(code);
      lobbies[code].players.push(socket.id);
      socket.emit('startGame', { mapData: lobbies[code].map });
    } else {
      socket.emit('error', 'Lobby does not exist');
    }
  });

  // Handle player hit
  socket.on('playerHit', (code) => {
    io.to(code).emit('hit');
  });

  // Player died
  socket.on('playerDead', () => {
    console.log('Player died');
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected');
  });
});

function generateGameCode() {
  return Math.random().toString(36).substr(2, 5).toUpperCase();
}

function generateRandomMap() {
  // Generate random map data here
  return [];
}

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
