// Require the express module
const express = require('express');
const app = express();
const dateTime = require('simple-datetime-formater');
const bodyParser = require('body-parser');

const chatRouter = require('./route/chatroute');
const loginRouter = require('./route/loginroute');

// Require the 'http' module
const http = require('http').Server(app);

// Require the 'socket.io' module
const io = require('socket.io');

const port = 5000;

// Bodyparser middleware
app.use(bodyParser.json());

// Routes
app.use('/chats', chatRouter);
app.use('/login', loginRouter);

// Set the express.static middleware
app.use(express.static(__dirname + '/public'));

// Integrating 'socket.io'
socket = io(http);

// Database connection
const Chat = require('./models/Chat');
const connect = require('./config/db');

// Setup event listener
socket.on('connection', socket => {
  console.log('user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  // Someone is typing
  socket.on('typing', data => {
    socket.broadcast.emit('notifyTyping', {
      user: data.user,
      message: data.message
    });
  });

  // When soemone stops typing
  socket.on('stopTyping', () => {
    socket.broadcast.emit('notifyStopTyping');
  });

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);

    // Broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit('received', { message: msg });

    // Save chat to the database
    connect.then(db => {
      console.log('connected correctly to the server');
      let chatMessage = new Chat({ message: msg, sender: 'Anonymous' });

      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log('Running on Port: ' + port);
});
