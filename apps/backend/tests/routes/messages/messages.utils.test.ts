import { PoolClient } from 'pg';
import { getMessagesByConversationId } from '../../../src/routes/messages/utils';

describe('getMessagesByConversationId', () => {
  let fakeClient: Partial<PoolClient>;

  beforeEach(() => {
    fakeClient = {
      query: jest.fn(),
    };
  });

  it('should return messages when rows are found', async () => {
    const fakeRows = [{ id: 'msg1', conversation_id: 'conv-1', content: 'Hello' }];
    (fakeClient.query as jest.Mock).mockResolvedValueOnce({ rows: fakeRows });

    const result = await getMessagesByConversationId(fakeClient as PoolClient, 'conv-1');
    expect(fakeClient.query).toHaveBeenCalledWith(
      'SELECT * FROM messages WHERE conversation_id = $1',
      ['conv-1']
    );
    expect(result).toEqual(fakeRows);
  });

  it('should log a message when no messages are found', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    (fakeClient.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const result = await getMessagesByConversationId(fakeClient as PoolClient, 'conv-2');
    expect(fakeClient.query).toHaveBeenCalledWith(
      'SELECT * FROM messages WHERE conversation_id = $1',
      ['conv-2']
    );
    expect(consoleSpy).toHaveBeenCalledWith('No messages found for conversation: conv-2');
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
  });
});
