import { Server } from 'http';
import { app } from '@/app';
import { pool } from '@/lib/db';

describe('Integration tests for /api/chat using node-fetch', () => {
  let server: Server;
  let baseURL: string;

  beforeAll((done) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (typeof address === 'object' && address !== null) {
        baseURL = `http://localhost:${address.port}`;
      }

      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return 400 if message is missing', async () => {
    const response = await fetch(`${baseURL}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        conversation_id: 'abc-123',
      }),
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toMatchObject({ error: 'Message is required' });
  });

  it('should create a new conversation if no conversation_id is provided', async () => {
    const response = await fetch(`${baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello!',
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('conversation_id');
    expect(data).toHaveProperty('response');
  });
});
