import { Request, Response, NextFunction } from 'express';
import router from '../../../src/routes/messages';
import { getMessagesByConversationId } from '../../../src/routes/messages/utils';

// Mock the utility function.
jest.mock('../../../src/routes/messages/utils', () => ({
  getMessagesByConversationId: jest.fn(),
}));

// Prepare a fake database client.
const fakeClient: any = {
  query: jest.fn(),
  release: jest.fn(),
};

// Mock the database pool so that connect() returns our fake client.
jest.mock('../../../src/lib/db', () => ({
  pool: {
    connect: jest.fn(() => Promise.resolve(fakeClient)),
  },
}));

describe('GET /:conversationId router', () => {
  let getHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  
  beforeAll(() => {
    // Extract the GET handler from the router's stack.
    const layer = router.stack.find(
      (layer: any) =>
        layer.route &&
        layer.route.path === '/:conversationId' &&
        layer.route.methods.get
    );
    if (layer && layer.route) {
      getHandler = layer.route.stack[0].handle;
    } else {
      throw new Error('GET route handler not found');
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return messages on a successful GET request', async () => {
    // Simulate a successful transaction.
    fakeClient.query
      .mockResolvedValueOnce({})  // For 'BEGIN'
      .mockResolvedValueOnce({});  // For 'COMMIT'
    // Simulate messages being returned.
    (getMessagesByConversationId as jest.Mock).mockResolvedValueOnce([
      { id: 'msg1', content: 'Hello' },
    ]);

    const req = {
      params: {
        conversationId: 'conv-1',
      },
    } as unknown as Request;
    
    let jsonResponse: any;
    const res = {
      json: jest.fn((result) => { jsonResponse = result; }),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getHandler(req, res, () => {});

    expect(fakeClient.query).toHaveBeenCalledWith('BEGIN');
    expect(getMessagesByConversationId).toHaveBeenCalledWith(fakeClient, 'conv-1');
    expect(fakeClient.query).toHaveBeenCalledWith('COMMIT');
    expect(res.json).toHaveBeenCalledWith({ messages: [{ id: 'msg1', content: 'Hello' }] });
    expect(fakeClient.release).toHaveBeenCalled();
  });

  it('should handle errors by rolling back and returning a 500 error', async () => {
    // Simulate a successful BEGIN.
    fakeClient.query.mockResolvedValueOnce({}); // For 'BEGIN'
    // Make getMessagesByConversationId throw an error.
    (getMessagesByConversationId as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
    // Simulate that the ROLLBACK call succeeds.
    fakeClient.query.mockResolvedValueOnce({}); // For 'ROLLBACK'

    const req = {
      params: {
        conversationId: 'conv-2',
      },
    } as unknown as Request;
    
    let jsonResponse: any;
    const res = {
      json: jest.fn((result) => { jsonResponse = result; }),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getHandler(req, res, () => {});

    expect(fakeClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(fakeClient.release).toHaveBeenCalled();
  });
});
