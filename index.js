const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = new Map();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

io.on('connection', (socket) => {
  socket.on('user:join', (rawName) => {
    const username = String(rawName || 'Guest').trim().slice(0, 24) || 'Guest';
    users.set(socket.id, username);

    socket.emit('system:message', {
      text: `Welcome, ${username}!`,
      time: new Date().toISOString()
    });

    socket.broadcast.emit('system:message', {
      text: `${username} joined the chat.`,
      time: new Date().toISOString()
    });

    io.emit('users:count', users.size);
  });

  socket.on('chat:message', (rawMessage) => {
    const username = users.get(socket.id);
    const text = String(rawMessage || '').trim().slice(0, 500);

    if (!username || !text) {
      return;
    }

    io.emit('chat:message', {
      id: `${Date.now()}-${socket.id}`,
      senderId: socket.id,
      username,
      text,
      time: new Date().toISOString()
    });
  });

  socket.on('typing:start', () => {
    const username = users.get(socket.id);
    if (username) {
      socket.broadcast.emit('typing:start', username);
    }
  });

  socket.on('typing:stop', () => {
    socket.broadcast.emit('typing:stop');
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);

    if (username) {
      socket.broadcast.emit('system:message', {
        text: `${username} left the chat.`,
        time: new Date().toISOString()
      });
    }

    io.emit('users:count', users.size);
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Lab4_naqviku server running on port ${PORT}`);
});
