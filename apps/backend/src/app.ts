import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import 'module-alias/register';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);