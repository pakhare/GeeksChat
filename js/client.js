// client.js

// creates a WebSocket connection
//between the client and the server using Socket.IO.
const socket = io();

// Ask username in popup functionality
const popup = document.querySelector('.popup');
popup.style.display = 'none';
window.addEventListener('load', () => {
    popup.style.display = 'flex';
});
const usernameInput = document.getElementById('username');
usernameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('startChatBtn').click();
  }
});
let name;
document.getElementById('startChatBtn').addEventListener('click', () => {
    name = document.getElementById('username').value.trim();
    if (name !== '') {
        popup.style.display = 'none';
        socket.emit('userConnected', name);
  }
});

// Send Message functionality
const textarea = document.querySelector('#textarea');
const messageArea = document.querySelector('.messageBlock');
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      sendMessage(e.target.value);
    }
});
function sendMessage(message) {
    const msg = {
        user: name,
        message: message.trim()
    };
    appendMessage(msg, 'sent');
    textarea.value = '';
    scrollToBottom();
    socket.emit('message', msg);
}

// receive message from server
socket.on('message', (msg) => {
  appendMessage(msg, 'received');
  scrollToBottom();
});

// scrolls along with messages to the bottom
function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

// rendering message into browser
function appendMessage(msg, type) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');
    if (msg.message.startsWith('data:image')) {
    const image = document.createElement('img');
    image.classList.add('message-image');
    image.src = msg.message;
    mainDiv.appendChild(image);
  	}
    else {
    const text = document.createElement('p');
    text.textContent = msg.message;
    mainDiv.appendChild(text);
  	}
    
    const user = document.createElement('h4');
    user.textContent = msg.user;
    mainDiv.appendChild(user);
    
    function getCurrentTimestamp () {
    return new Date().toLocaleTimeString('en-US', { hour12: true, 
      hour: "numeric", 
      minute: "numeric"});
    }
    const timestamp = document.createElement('span');
    timestamp.textContent = getCurrentTimestamp();
    mainDiv.appendChild(timestamp);

    messageArea.appendChild(mainDiv);
}

const fileInput = document.querySelector('#file-input');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target.result;
      sendMessage(imageSrc);
    };
    reader.readAsDataURL(file);
  }
});

// For showing Active users
const userList = document.querySelector('.user-list');

// receive userList from server
socket.on('userList', (users) => {
    appendUserList(users);
});

function appendUserList(users) {
    userList.innerHTML = '';
    users.forEach(user => {
      const userItem = document.createElement('li');
      userItem.innerText = user;
      userList.appendChild(userItem);
    });
}