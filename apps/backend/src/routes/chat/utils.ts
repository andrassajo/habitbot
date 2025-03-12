  /**
 * Creates a new conversation record in the database.
 *
 * @param client - The PostgreSQL client to use for the transaction.
 * @param title - The title of the conversation.
 * @returns {Promise<string>} A promise that resolves to the newly created conversation ID.
 */
export async function createConversation(client: any, title: string): Promise<string> {
    const result = await client.query(
      'INSERT INTO conversations(title) VALUES($1) RETURNING id',
      [title]
    );
    const newConversationId = result.rows[0].id;
    return newConversationId;
  }
  
  /**
 * Inserts a message into the messages table.
 *
 * @param client - The PostgreSQL client to use for the transaction.
 * @param conversationId - The conversation ID associated with the message.
 * @param role - The role of the sender (e.g., 'user', 'assistant').
 * @param content - The text content of the message.
 * @returns {Promise<void>} A promise that resolves when the message has been inserted.
 */
export async function insertMessage(
    client: any,
    conversationId: string,
    role: string,
    content: string
  ): Promise<void> {
    await client.query(
      'INSERT INTO messages(conversation_id, role, content) VALUES($1, $2, $3)',
      [conversationId, role, content]
    );
  }
  