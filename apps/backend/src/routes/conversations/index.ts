import { Router } from 'express';
import dotenv from 'dotenv';
import { pool } from '@/lib/db';
import { getConversationById, getConversationsByUser } from './utils';
dotenv.config();

const router = Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const clientDb = await pool.connect();
  
  try {
    await clientDb.query('BEGIN');

    console.log('id', id);

    const conversation = await getConversationById(clientDb, id);

    await clientDb.query('COMMIT');

    res.json({ conversation });
  } catch (error) {
    console.log('Error getting conversation:', error);
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientDb.release();
  }
});

router.get('/by-user/:user', async (req, res) => {
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
