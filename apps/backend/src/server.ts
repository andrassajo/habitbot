import { app } from './app';
import http from 'http';
import { initSocket } from './lib/socket';

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = initSocket(server);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
