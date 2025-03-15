import { Router } from 'express';
import dotenv from 'dotenv';
import { ensureConversation, ensureUser, getCategoryIdByKey, insertMessage } from './utils';
import { pool } from '../../lib/db';
import { getIO } from '../../lib/socket';
import { getResponse } from '../../lib/openai';
dotenv.config();

const router = Router();

router.post('/', async (req, res) => {
  const { message, conversation_id: conversation_id_, user_id, category_key } = req.body;
  console.log(`Endpoint /api/chat called with: ${message}`);
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const clientDb = await pool.connect();
  try {
    await clientDb.query('BEGIN');
    const category = await getCategoryIdByKey(clientDb, category_key);
    const user = await ensureUser(clientDb, user_id);
    const conversation_id = await ensureConversation(clientDb, conversation_id_, message, category, user);

    // Insert user message
    const userMessage = await insertMessage(clientDb, conversation_id, user, 'user', message, category);

    // Emit user message to frontend
    const io = getIO();
    console.log('Emitting user message event');
    io.emit('chat message', { conversation_id, ...userMessage });

    // Get AI response and insert assistant message
    const aiResponse = await getResponse(conversation_id, message, category);
    const assistantMessage = await insertMessage(clientDb, conversation_id, user, 'assistant', aiResponse, category);

    await clientDb.query('COMMIT');

    // Emit assistant message
    console.log('Emitting assistant message event');
    io.emit('chat message', { conversation_id, ...assistantMessage });

    res.json({ success: true, conversation_id, response: aiResponse });
  } catch (error) {
    console.error('Error processing message:', error);
    await clientDb.query('ROLLBACK');
    res.status(500).json({ error });
  } finally {
    clientDb.release();
  }
});

export default router;
