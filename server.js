const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root URL by sending the 'index.html' file from the 'public' folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle connections with Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the 'draw' event
  socket.on('draw', (data) => {
    // Receive drawing data and broadcast it to other clients
    socket.broadcast.emit('draw', data);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
