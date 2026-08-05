const socket = io();

const joinOverlay = document.getElementById('join-overlay');
const joinForm = document.getElementById('join-form');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sendButton = messageForm.querySelector('button');
const messages = document.getElementById('messages');
const emptyState = document.getElementById('empty-state');
const onlineCount = document.getElementById('online-count');
const typingIndicator = document.getElementById('typing-indicator');

let username = '';
let typingTimer;

function formatTime(isoTime) {
  return new Intl.DateTimeFormat([], {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(isoTime));
}

function removeEmptyState() {
  if (emptyState?.isConnected) {
    emptyState.remove();
  }
}

function scrollToLatest() {
  messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(message) {
  removeEmptyState();
  const item = document.createElement('li');
  item.className = 'system-message';
  item.textContent = message.text;
  messages.appendChild(item);
  scrollToLatest();
}

function addChatMessage(message) {
  removeEmptyState();

  const item = document.createElement('li');
  const isOwnMessage = message.senderId === socket.id;
  item.className = `message-row${isOwnMessage ? ' own' : ''}`;

  const bubble = document.createElement('article');
  bubble.className = 'message-bubble';

  const meta = document.createElement('div');
  meta.className = 'message-meta';

  const sender = document.createElement('strong');
  sender.textContent = isOwnMessage ? 'You' : message.username;

  const time = document.createElement('time');
  time.dateTime = message.time;
  time.textContent = formatTime(message.time);

  const text = document.createElement('p');
  text.className = 'message-text';
  text.textContent = message.text;

  meta.append(sender, time);
  bubble.append(meta, text);
  item.appendChild(bubble);
  messages.appendChild(item);
  scrollToLatest();
}

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  username = nameInput.value.trim().slice(0, 24);

  if (!username) {
    nameInput.focus();
    return;
  }

  socket.emit('user:join', username);
  joinOverlay.classList.add('hidden');
  messageInput.disabled = false;
  sendButton.disabled = false;
  messageInput.focus();
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  socket.emit('chat:message', message);
  socket.emit('typing:stop');
  messageInput.value = '';
  messageInput.focus();
});

messageInput.addEventListener('input', () => {
  clearTimeout(typingTimer);

  if (messageInput.value.trim()) {
    socket.emit('typing:start');
    typingTimer = setTimeout(() => socket.emit('typing:stop'), 900);
  } else {
    socket.emit('typing:stop');
  }
});

socket.on('chat:message', addChatMessage);
socket.on('system:message', addSystemMessage);

socket.on('users:count', (count) => {
  onlineCount.textContent = `${count} ${count === 1 ? 'person' : 'people'} online`;
});

socket.on('typing:start', (name) => {
  typingIndicator.textContent = `${name} is typing...`;
});

socket.on('typing:stop', () => {
  typingIndicator.textContent = '';
});

socket.on('disconnect', () => {
  onlineCount.textContent = 'Reconnecting...';
});
