import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import categoryRouter from './routes/category';
import messagesRouter from './routes/messages';
import conversationsRouter from './routes/conversations';
import http from 'http';
import { initSocket } from './lib/socket';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/category', categoryRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/conversations', conversationsRouter);


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