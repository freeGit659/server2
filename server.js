const express = require("express")
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

let socketsConected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
  console.log('User connected', socket.id);
  socketsConected.add(socket.id);
  io.emit('clients-total', socketsConected.size);

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
    socketsConected.delete(socket.id);
    io.emit('clients-total', socketsConected.size);
  });

  socket.on('sendMessage', data => {
    console.log(data)
    socket.broadcast.emit('newMessage', data);
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', data);
  });
}
