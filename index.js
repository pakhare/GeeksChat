// index.js

// import express
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

// listen to port 3000
server.listen(3000, () => {
    console.log('Server running on port 3000');
});

// for '/' route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.use(express.static(__dirname + '/css'))
app.use(express.static(__dirname + '/js'))

// import socket.io
const socketIO = require('socket.io');
const io = socketIO(server);

// user connection and messages functionality
let users = [];
io.on('connection', (socket) => {
    socket.on('userConnected', (user) => {
        socket.username = user;
        console.log(`User connected ${socket.username}`);
        users.push(user);
        // send list to client
        io.emit('userList', users);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.username}`);
        users = users.filter(user => user !== socket.username);
        // send the list to client
        io.emit('userList', users);
    });

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    });

});