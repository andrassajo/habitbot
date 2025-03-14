import { Router } from 'express';
import dotenv from 'dotenv';
import { pool } from '@/lib/db';
import { getConversationsByUser } from './utils';
dotenv.config();

const router = Router();

router.get('/:user', async (req, res) => {
  const { user } = req.params;
  const clientDb = await pool.connect();
  
  try {
    await clientDb.query('BEGIN');

    const conversations = await getConversationsByUser(clientDb, user);

    await clientDb.query('COMMIT');

    res.json({ conversations });
  } catch (error) {
    console.log('Error getting conversations:', error);
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientDb.release();
  }
});

export default router;
