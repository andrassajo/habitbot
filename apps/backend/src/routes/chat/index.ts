import { Router } from 'express';
import dotenv from 'dotenv';
import { generateTitle, getResponse } from '@/lib/openai';
import { ensureConversation, ensureUser, getCategoryByKey, insertMessage } from './utils';
import { pool } from '@/lib/db';
dotenv.config();

const router = Router();

/**
 * POST / - Handles incoming messages for a conversation.
 *
 * This endpoint checks for an existing conversation_id. If not provided, it creates a new conversation.
 * It then inserts the user message, fetches the AI response, and inserts the assistant message.
 * The entire process is wrapped in a transaction to ensure atomicity.
 *
 * Request body should include:
 *  - message: The user's message text (required).
 *  - conversation_id: An optional conversation identifier. If omitted, a new conversation is created.
 *
 * @route POST /
 * @param req - Express request object containing the message and optional conversation_id.
 * @param res - Express response object used to return the result.
 */
router.post('/', async (req, res) => {
  const {
    message,
    conversation_id: conversation_id_,
    user_id,
    category_key  
  } = req.body;

  console.log(`Endpoint /api/chat called with: ${message}`);
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const clientDb = await pool.connect();
  try {
    await clientDb.query('BEGIN');

    const category = await getCategoryByKey(clientDb, category_key);

    const  conversation_id = await ensureConversation(clientDb, conversation_id_, message, category);

    const user = await ensureUser(clientDb, user_id,);

    await insertMessage(clientDb, conversation_id, user, 'user', message, category);

    const aiResponse = await getResponse(conversation_id, message);

    await insertMessage(clientDb, conversation_id, user, 'assistant', aiResponse, category);

    await clientDb.query('COMMIT');

    res.json({ success: true, conversation_id, response: aiResponse });
  } catch (error) {
    console.log('Error processing message:', error);
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error });
  } finally {
    clientDb.release();
  }
});

export default router;
