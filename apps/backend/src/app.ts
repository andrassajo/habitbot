import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
import categoryRouter from './routes/category';
import messagesRouter from './routes/messages';
import conversationsRouter from './routes/conversations';
import 'module-alias/register';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/category', categoryRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/conversations', conversationsRouter);