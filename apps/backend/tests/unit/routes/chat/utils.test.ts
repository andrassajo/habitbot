import { createConversation, insertMessage } from "@/routes/chat/utils";

describe('Database Utility Functions', () => {
  describe('createConversation', () => {
    it('should insert a conversation and return the new conversation id', async () => {
      const fakeClient = {
        query: jest.fn().mockResolvedValue({ rows: [{ id: '1234' }] }),
      };
      const title = 'Test Conversation';

      const conversationId = await createConversation(fakeClient, title);

      expect(fakeClient.query).toHaveBeenCalledWith(
        'INSERT INTO conversations(title) VALUES($1) RETURNING id',
        [title]
      );
      expect(conversationId).toBe('1234');
    });

    it('should throw an error if the query fails', async () => {
      const fakeError = new Error('Query failed');
      const fakeClient = {
        query: jest.fn().mockRejectedValue(fakeError),
      };
      await expect(createConversation(fakeClient, 'Test Conversation')).rejects.toThrow('Query failed');
    });

    it('should throw an error if no rows are returned', async () => {
      const fakeClient = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
      };

      await expect(createConversation(fakeClient, 'Test Conversation')).rejects.toThrow();
    });
  });

  describe('insertMessage', () => {
    it('should insert a message into the messages table', async () => {
      const fakeClient = {
        query: jest.fn().mockResolvedValue({}),
      };
      const conversationId = '1234';
      const role = 'user';
      const content = 'This is a test message.';

      await insertMessage(fakeClient, conversationId, role, content);

      expect(fakeClient.query).toHaveBeenCalledWith(
        'INSERT INTO messages(conversation_id, role, content) VALUES($1, $2, $3)',
        [conversationId, role, content]
      );
    });

    it('should throw an error if the query fails', async () => {
      const fakeError = new Error('Insert failed');
      const fakeClient = {
        query: jest.fn().mockRejectedValue(fakeError),
      };
      const conversationId = '1234';
      const role = 'assistant';
      const content = 'Hello, world';

      await expect(insertMessage(fakeClient, conversationId, role, content)).rejects.toThrow('Insert failed');
    });
  });
});
