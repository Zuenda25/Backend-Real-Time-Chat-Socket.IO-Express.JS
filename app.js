const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.options('*', cors());
const http = require('http');

const server = http.Server(app);
const socketIO = require('socket.io');

const io = socketIO(server);
const port = process.env.PORT || 26084;

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user joined chat room');
  });

  socket.on('writing', (data) => {
    io.in(data.room).emit('is writing', {
      data,
    });
  });

  socket.on('message', (data) => {
    io.in(data.room).emit('new message', {
      user: data.user,
      message: data.message,
    });
  });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`started on port: ${port}`);
});
