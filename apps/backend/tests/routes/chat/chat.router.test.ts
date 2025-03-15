import { Request, Response, NextFunction } from 'express';
import router from '../../../src/routes/chat';

// --- Mocks for external dependencies ---
// Mock utils functions
jest.mock('../../../src/routes/chat/utils', () => ({
  ensureConversation: jest.fn(() => Promise.resolve('conv-id')),
  ensureUser: jest.fn(() => Promise.resolve('user-id')),
  getCategoryIdByKey: jest.fn(() => Promise.resolve('cat-id')),
  insertMessage: jest
    .fn()
    // First call for user message.
    .mockImplementationOnce(() =>
      Promise.resolve({ id: 'user-msg-id', role: 'user', content: 'Hello world' })
    )
    // Second call for assistant message.
    .mockImplementationOnce(() =>
      Promise.resolve({ id: 'assistant-msg-id', role: 'assistant', content: 'AI response' })
    ),
}));

// Mock OpenAI functions
jest.mock('../../../src/lib/openai', () => ({
  generateTitle: jest.fn(() => Promise.resolve('Test Title')),
  getResponse: jest.fn(() => Promise.resolve('AI response')),
}));

// Mock socket IO
const mockEmit = jest.fn();
jest.mock('../../../src/lib/socket', () => ({
  getIO: jest.fn(() => ({ emit: mockEmit })),
}));

// Mock the database pool and its client.
const fakeClient: any = {
  query: jest.fn(() => Promise.resolve({})),
  release: jest.fn(),
};
jest.mock('../../../src/lib/db', () => ({
  pool: {
    connect: jest.fn(() => Promise.resolve(fakeClient)),
  },
}));

// --- Extract the POST route handler from the router ---
let postHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
beforeAll(() => {
  // Express router stores route definitions in its "stack" array.
  const routeLayer = router.stack.find(
    (layer: any) => layer.route && layer.route.path === '/' && layer.route.methods.post
  );
  if (routeLayer && routeLayer.route) {
    postHandler = routeLayer.route.stack[0].handle;
  } else {
    throw new Error('POST route handler not found');
  }
});

describe('Chat API Router', () => {
  // Reset mocks before each test.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if message is missing', async () => {
    const req = {
      body: { conversation_id: 'conv-123', user_id: 'user-123', category_key: 'cat-key' },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    
    await postHandler(req, res, () => {});
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
  });

  it('should process a valid chat message and return success', async () => {
    // Prepare fake queries for BEGIN and COMMIT.
    fakeClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // COMMIT after assistant message insertion.
      .mockResolvedValue({});    // In case additional queries are executed.

    const req = {
      body: {
        message: 'Hello world',
        conversation_id: 'conv-123',
        user_id: 'user-123',
        category_key: 'cat-key',
      },
    } as Request;

    // Create a fake response object.
    let jsonResponse: any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((result) => {
        jsonResponse = result;
      }),
    } as unknown as Response;

    await postHandler(req, res, () => {});

    // Assert the response status and payload.
    expect(res.json).toHaveBeenCalled();
    expect(jsonResponse).toEqual({
      success: true,
      conversation_id: 'conv-id',
      response: 'AI response',
    });

    // Verify that socket events were emitted.
    expect(mockEmit).toHaveBeenCalledWith('chat message', {
      conversation_id: 'conv-id',
      id: 'user-msg-id',
      role: 'user',
      content: 'Hello world',
    });
    expect(mockEmit).toHaveBeenCalledWith('chat message', {
      conversation_id: 'conv-id',
      id: 'assistant-msg-id',
      role: 'assistant',
      content: 'AI response',
    });

    // Ensure that the database client was released.
    expect(fakeClient.release).toHaveBeenCalled();
  });

  it('should handle errors and rollback transaction', async () => {
    // Simulate an error after BEGIN is called.
    fakeClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockImplementationOnce(() => {
        throw new Error('Test error');
      });

    const req = {
      body: {
        message: 'Hello error',
        conversation_id: 'conv-err',
        user_id: 'user-err',
        category_key: 'cat-key',
      },
    } as Request;
    
    let jsonResponse: any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((result) => {
        jsonResponse = result;
      }),
    } as unknown as Response;

    await postHandler(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonResponse).toHaveProperty('error');
    // Verify that a ROLLBACK was attempted.
    expect(fakeClient.query).toHaveBeenCalledWith('ROLLBACK');
    // Ensure the client was released.
    expect(fakeClient.release).toHaveBeenCalled();
  });
});
