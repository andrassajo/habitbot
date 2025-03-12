import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import 'module-alias/register';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
