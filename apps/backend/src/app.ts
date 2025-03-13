import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
import 'module-alias/register';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);