import { PoolClient } from 'pg';
import { getConversationById, getConversationsByUser } from '../../../src/routes/conversations/utils';

describe('Conversations Utils', () => {
  let fakeClient: Partial<PoolClient>;

  beforeEach(() => {
    fakeClient = {
      query: jest.fn(),
    };
  });

  describe('getConversationById', () => {
    it('should return the conversation when found', async () => {
      const fakeConversation = { id: 'conv-1', title: 'Test Conversation' };
      (fakeClient.query as jest.Mock).mockResolvedValueOnce({ rows: [fakeConversation] });

      const result = await getConversationById(fakeClient as PoolClient, 'conv-1');
      expect(fakeClient.query).toHaveBeenCalledWith(
        'SELECT * FROM conversations WHERE id = $1',
        ['conv-1']
      );
      expect(result).toEqual(fakeConversation);
    });
  });

  describe('getConversationsByUser', () => {
    it('should return an array of conversations for the user', async () => {
      const fakeRows = [
        { id: 'conv-1', title: 'Conversation One', categoryname: 'Cat1', categorykey: 'key1' },
        { id: 'conv-2', title: 'Conversation Two', categoryname: 'Cat2', categorykey: 'key2' },
      ];
      (fakeClient.query as jest.Mock).mockResolvedValueOnce({ rows: fakeRows });

      const result = await getConversationsByUser(fakeClient as PoolClient, 'user-1');
      expect(fakeClient.query).toHaveBeenCalledWith(
        `SELECT conv.id, conv.title, cat.name as categoryname, cat.key as categorykey
    FROM conversations as conv
    LEFT JOIN categories as cat ON conv.category_id = cat.id
    WHERE conv.user_id = $1`,
        ['user-1']
      );
      expect(result).toEqual(fakeRows);
    });
  });
});
