import { Router } from 'express';
import dotenv from 'dotenv';
import { getAllCategories, getCategoryByKey } from './utils';
import { pool } from '../../lib/db';
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

router.get('/:key', async (req, res) => {
  const { key } = req.params;
  const clientDb = await pool.connect();
  
  try {
    await clientDb.query('BEGIN');

    const category = await getCategoryByKey(clientDb, key);

    await clientDb.query('COMMIT');

    res.json({ category });
  } catch (error) {
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientDb.release();
  }
});

export default router;
