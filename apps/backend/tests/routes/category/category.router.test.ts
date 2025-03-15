import { Request, Response, NextFunction } from 'express';
import router from '../../../src/routes/category';

// --- Mock the utility functions ---
import { getAllCategories, getCategoryByKey } from '../../../src/routes/category/utils';
jest.mock('../../../src/routes/category/utils', () => ({
  getAllCategories: jest.fn(),
  getCategoryByKey: jest.fn(),
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
let getAllHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
let getByKeyHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;

beforeAll(() => {
  // Find GET /all route
  const allLayer = router.stack.find((layer: any) =>
    layer.route && layer.route.path === '/all' && layer.route.methods.get
  );
  if (!allLayer) throw new Error('GET /all not found');
  if (!allLayer.route) throw new Error('Route for GET /all not found');
  getAllHandler = allLayer.route.stack[0].handle;

  // Find GET /:key route
  const keyLayer = router.stack.find((layer: any) =>
    layer.route && layer.route.path === '/:key' && layer.route.methods.get
  );
  if (!keyLayer) throw new Error('GET /:key not found');
  if (!keyLayer.route) throw new Error('Route for GET /:key not found');
  getByKeyHandler = keyLayer.route.stack[0].handle;
});

describe('Categories Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /all', () => {
    it('should return all categories on success', async () => {
      // Simulate transaction commands.
      fakeClient.query.mockResolvedValueOnce({})  // For 'BEGIN'
        .mockResolvedValueOnce({});                // For 'COMMIT'

      const fakeCategories = [
        { id: 'cat1', name: 'Category 1', key: 'cat1key' },
        { id: 'cat2', name: 'Category 2', key: 'cat2key' },
      ];
      (getAllCategories as jest.Mock).mockResolvedValueOnce(fakeCategories);

      const req = {} as Request;
      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getAllHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(getAllCategories).toHaveBeenCalledWith(fakeClient);
      expect(fakeClient.query).toHaveBeenNthCalledWith(2, 'COMMIT');
      expect(res.json).toHaveBeenCalledWith({ categories: fakeCategories });
      expect(fakeClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback for GET /all', async () => {
      fakeClient.query.mockResolvedValueOnce({});  // For 'BEGIN'
      (getAllCategories as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      fakeClient.query.mockResolvedValueOnce({});  // For 'ROLLBACK'

      const req = {} as Request;
      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getAllHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      expect(fakeClient.release).toHaveBeenCalled();
    });
  });

  describe('GET /:key', () => {
    it('should return a category by key on success', async () => {
      fakeClient.query.mockResolvedValueOnce({})  // For 'BEGIN'
        .mockResolvedValueOnce({});                // For 'COMMIT'

      const fakeCategory = { id: 'cat1', name: 'Category 1', key: 'cat1key' };
      (getCategoryByKey as jest.Mock).mockResolvedValueOnce(fakeCategory);

      const req = { params: { key: 'cat1key' } } as unknown as Request;
      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getByKeyHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(getCategoryByKey).toHaveBeenCalledWith(fakeClient, 'cat1key');
      expect(fakeClient.query).toHaveBeenNthCalledWith(2, 'COMMIT');
      expect(res.json).toHaveBeenCalledWith({ category: fakeCategory });
      expect(fakeClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback for GET /:key', async () => {
      fakeClient.query.mockResolvedValueOnce({});  // For 'BEGIN'
      (getCategoryByKey as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      fakeClient.query.mockResolvedValueOnce({});  // For 'ROLLBACK'

      const req = { params: { key: 'nonexistent' } } as unknown as Request;
      let jsonResponse: any;
      const res = {
        json: jest.fn((result) => { jsonResponse = result; }),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getByKeyHandler(req, res, () => {});

      expect(fakeClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      expect(fakeClient.release).toHaveBeenCalled();
    });
  });
});
