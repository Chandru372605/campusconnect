const { Server } = require('socket.io');

function setupSockets(server) {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ room }) => {
      socket.join(room);
    });
    socket.on('sendMessage', (msg) => {
      io.to(msg.room).emit('receiveMessage', msg);
    });
  });
}
module.exports = { setupSockets };