import { Request, Response, NextFunction } from 'express';
import router from '../../../src/routes/conversations';
import { getConversationById, getConversationsByUser } from '../../../src/routes/conversations/utils';

// --- Mock the utility functions ---
jest.mock('../../../src/routes/conversations/utils', () => ({
  getConversationById: jest.fn(),
  getConversationsByUser: jest.fn(),
}));

// --- Prepare a fake database client ---
const fakeClient: any = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock('../../../src/lib/db', () => ({
  pool: {
    connect: jest.fn(() => Promise.resolve(fakeClient)),
  },
}));

// --- Extract the route handlers from the router ---
let getByIdHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
let getByUserHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;

beforeAll(() => {
  // Find the GET route for '/:id'
  const idLayer = router.stack.find((layer: any) =>
    layer.route && layer.route.path === '/:id' && layer.route.methods.get
  );
  if (!idLayer) {
    throw new Error('GET /:id route not found');
  }
  if (idLayer && idLayer.route) {
    getByIdHandler = idLayer.route.stack[0].handle;
  }

  // Find the GET route for '/by-user/:user'
  const userLayer = router.stack.find((layer: any) =>
    layer.route && layer.route.path === '/by-user/:user' && layer.route.methods.get
  );
  if (!userLayer) {
    throw new Error('GET /by-user/:user route not found');
  }
  if (userLayer && userLayer.route) {
    getByUserHandler = userLayer.route.stack[0].handle;
  }
});

describe('Conversations Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /:id', () => {
    it('should return the conversation on success', async () => {
      // Simulate a successful transaction: BEGIN and COMMIT.
      fakeClient.query
        .mockResolvedValueOnce({})  // BEGIN
        .mockResolvedValueOnce({}); // COMMIT

      // Set up the utility function to return a conversation.
      (getConversationById as jest.Mock).mockResolvedValueOnce({ id: 'conv-1', title: 'Test Conversation' });

      const req = {
        params: { id: 'conv-1' },
      } as unknown as Request;

      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getByIdHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenCalledWith('BEGIN');
      expect(getConversationById).toHaveBeenCalledWith(fakeClient, 'conv-1');
      expect(fakeClient.query).toHaveBeenCalledWith('COMMIT');
      expect(res.json).toHaveBeenCalledWith({ conversation: { id: 'conv-1', title: 'Test Conversation' } });
      expect(fakeClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback on failure', async () => {
      // Simulate BEGIN call.
      fakeClient.query.mockResolvedValueOnce({}); // BEGIN
      // Make getConversationById throw an error.
      (getConversationById as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      // Simulate ROLLBACK.
      fakeClient.query.mockResolvedValueOnce({}); // ROLLBACK

      const req = {
        params: { id: 'conv-error' },
      } as unknown as Request;

      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getByIdHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      expect(fakeClient.release).toHaveBeenCalled();
    });
  });

  describe('GET /by-user/:user', () => {
    it('should return conversations for the user on success', async () => {
      // Simulate a successful transaction.
      fakeClient.query
        .mockResolvedValueOnce({})  // BEGIN
        .mockResolvedValueOnce({}); // COMMIT

      // Set up the utility function to return an array of conversations.
      const fakeConversations = [
        { id: 'conv-1', title: 'Conversation One', categoryname: 'Cat1', categorykey: 'key1' },
        { id: 'conv-2', title: 'Conversation Two', categoryname: 'Cat2', categorykey: 'key2' },
      ];
      (getConversationsByUser as jest.Mock).mockResolvedValueOnce(fakeConversations);

      const req = {
        params: { user: 'user-1' },
      } as unknown as Request;

      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getByUserHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenCalledWith('BEGIN');
      expect(getConversationsByUser).toHaveBeenCalledWith(fakeClient, 'user-1');
      expect(fakeClient.query).toHaveBeenCalledWith('COMMIT');
      expect(res.json).toHaveBeenCalledWith({ conversations: fakeConversations });
      expect(fakeClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback on failure', async () => {
      // Simulate BEGIN.
      fakeClient.query.mockResolvedValueOnce({}); // BEGIN
      // Make getConversationsByUser throw an error.
      (getConversationsByUser as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      // Simulate ROLLBACK.
      fakeClient.query.mockResolvedValueOnce({}); // ROLLBACK

      const req = {
        params: { user: 'user-error' },
      } as unknown as Request;

      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getByUserHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      expect(fakeClient.release).toHaveBeenCalled();
    });
  });
});
