import { getAllCategories, getCategoryByKey } from '../../../src/routes/category/utils';
import { PoolClient } from 'pg';

describe('Categories Utils', () => {
  let fakeClient: Partial<PoolClient>;

  beforeEach(() => {
    fakeClient = {
      query: jest.fn(),
    };
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const fakeRows = [
        { id: 'cat1', name: 'Category 1', key: 'cat1key' },
        { id: 'cat2', name: 'Category 2', key: 'cat2key' },
      ];
      (fakeClient.query as jest.Mock).mockResolvedValueOnce({ rows: fakeRows });
      
      const result = await getAllCategories(fakeClient as PoolClient);
      expect(fakeClient.query).toHaveBeenCalledWith('SELECT * FROM categories');
      expect(result).toEqual(fakeRows);
    });
  });

  describe('getCategoryByKey', () => {
    it('should return the category matching the key', async () => {
      const fakeCategory = { id: 'cat1', name: 'Category 1', key: 'cat1key' };
      (fakeClient.query as jest.Mock).mockResolvedValueOnce({ rows: [fakeCategory] });
      
      const result = await getCategoryByKey(fakeClient as PoolClient, 'cat1key');
      expect(fakeClient.query).toHaveBeenCalledWith('SELECT * FROM categories WHERE key = $1', ['cat1key']);
      expect(result).toEqual(fakeCategory);
    });
  });
});
