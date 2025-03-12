import { app } from '@/app';
import { Server } from 'http';

let server: Server;
let port: number;

beforeAll(async () => {
  server = app.listen(0);
  const address = server.address();
  if (address && typeof address === 'object') {
    port = address.port;
  } else {
    throw new Error('Unable to determine server port.');
  }
});

afterAll(async () => {
  server.close();
});

describe('E2E Tests', () => {
  it('should handle a full conversation flow', async () => {
    // 1) Start a new conversation
    const startRes = await fetch(`http://localhost:${port}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, how are you?' }),
    });

    expect(startRes.status).toBe(200);
    const startBody = await startRes.json();
    expect(startBody.conversation_id).toBeDefined();
    const conversationId = startBody.conversation_id;

    // 2) Continue the conversation
    const nextRes = await fetch(`http://localhost:${port}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is your name?', conversation_id: conversationId }),
    });

    expect(nextRes.status).toBe(200);
    const nextBody = await nextRes.json();
    expect(nextBody.conversation_id).toBe(conversationId);
    expect(nextBody.response).toBeDefined();
  });
});
