import { Router } from 'express';
import dotenv from 'dotenv';
import { pool } from '@/lib/db';
import { hash, verify } from 'argon2';
import _ from 'lodash';
import { createUser, findUserByEmail, generateTokens, updateHashedRefreshToken } from './utils';

dotenv.config();

const router = Router();

/**
 * @route   POST /signup
 * @desc    Register a new user with email, name, and password.
 * @param   {string} req.body.email - The user's email address.
 * @param   {string} req.body.name - The user's full name.
 * @param   {string} req.body.password - The user's password.
 * @returns {Object} The newly created user record (excluding the password).
 */
router.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;

  // Validate required fields.
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, name, and password are required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userExists = await findUserByEmail(client, email);
    if (userExists) {
      return res.status(409).json({ error: 'Email already exists.' });
    }


    const result = await createUser(client, email, name, password);

    await client.query('COMMIT');
    res.status(201).json(result);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during signup:', error);

    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
});

/**
 * @route   POST /signin
 * @desc    Authenticate a user with email and password.
 * @param   {string} req.body.email - The user's email address.
 * @param   {string} req.body.password - The user's password.
 * @returns {Object} The user record (excluding the password).
 */
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const client = await pool.connect();
  try {
    const user = await findUserByEmail(client, email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!await verify(user.password, password)) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
    
    const { accessToken, refreshToken } = await generateTokens(user.id);
    await updateHashedRefreshToken(pool, user.id, refreshToken);

    res.json({
      ..._.pick(user, ['id', 'email', 'name']),
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
});

export default router;
