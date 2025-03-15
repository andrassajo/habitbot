import { Router } from 'express';
import dotenv from 'dotenv';
import { getMessagesByConversationId } from './utils';
import { pool } from '../../lib/db';
dotenv.config();

const router = Router();

router.get('/:conversationId', async (req, res) => {
  const clientDb = await pool.connect();
  
  try {
    await clientDb.query('BEGIN');


    const messages = await getMessagesByConversationId(clientDb, req.params.conversationId);

    await clientDb.query('COMMIT');

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages', error);
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientDb.release();
  }
});

export default router;
