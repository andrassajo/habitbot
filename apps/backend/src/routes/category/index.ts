import { Router } from 'express';
import dotenv from 'dotenv';
import { pool } from '@/lib/db';
import { getAllCategories } from './utils';
dotenv.config();

const router = Router();

router.get('/all', async (req, res) => {
  const clientDb = await pool.connect();
  
  try {
    await clientDb.query('BEGIN');

    const categories = await getAllCategories(clientDb);

    await clientDb.query('COMMIT');

    res.json({ categories });
  } catch (error) {
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientDb.release();
  }
});

export default router;
