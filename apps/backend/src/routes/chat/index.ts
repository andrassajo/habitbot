import { Router } from 'express';
import dotenv from 'dotenv';
import { generateTitle, getResponse } from '@/lib/openai';
import { createConversation, insertMessage } from './utils';
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
  const { message, conversation_id } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const clientDb = await pool.connect();
  try {
    await clientDb.query('BEGIN');

    let conversationId = conversation_id;
    if (!conversationId) {
      const title = await generateTitle(message);
      conversationId = await createConversation(clientDb, title);
    }

    await insertMessage(clientDb, conversationId, 'user', message);

    const aiResponse = await getResponse(conversationId, message);

    await insertMessage(clientDb, conversationId, 'assistant', aiResponse);

    await clientDb.query('COMMIT');

    res.json({ conversation_id: conversationId, response: aiResponse });
  } catch (error) {
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientDb.release();
  }
});

export default router;
