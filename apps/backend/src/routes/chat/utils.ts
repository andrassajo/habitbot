import { Message } from "@shared/types";
import { PoolClient } from "pg";
import { generateTitle } from "../../lib/openai";

  /**
 * Creates a new conversation record in the database.
 *
 * @param client - The PostgreSQL client to use for the transaction.
 * @param title - The title of the conversation.
 * @returns {Promise<string>} A promise that resolves to the newly created conversation ID.
 */
export async function ensureConversation(client: any, conversation_id: string, message: string, category: string, user: string): Promise<string> {
  console.log(`Ensuring conversation with ID: ${conversation_id}`);
  
  const result = await client.query('SELECT id FROM conversations WHERE id = $1', [conversation_id]);

  if (result.rows.length === 0) {
    const title = await generateTitle(message);

    const result = await client.query(
      'INSERT INTO conversations(id, title, category_id, user_id) VALUES($1, $2, $3, $4) RETURNING id',
      [conversation_id, title, category, user]
    );
    const newConversationId = result.rows[0].id;

    console.log(`New conversation created with ID: ${newConversationId}`);

    return newConversationId;
  } else {
    console.log(`Conversation found by id: ${conversation_id}: ${result.rows[0]?.id}`);

    return result.rows[0].id;
  }
}
  
  /**
 * Inserts a message into the messages table.
 *
 * @param client - The PostgreSQL client to use for the transaction.
 * @param conversation_id - The conversation ID associated with the message.
 * @param role - The role of the sender (e.g., 'user', 'assistant').
 * @param content - The text content of the message.
 * @returns {Promise<void>} A promise that resolves when the message has been inserted.
 */
export async function insertMessage(
    client: any,
    conversation_id: string,
    user: string | null,
    role: string,
    content: string,
    category: string
  ): Promise<Pick<Message, 'id' | 'role' | 'content'>> {
    const message = await client.query(
      'INSERT INTO messages(conversation_id, role, user_id, content, category_id) VALUES($1, $2, $3, $4, $5) RETURNING id, role, content',
      [conversation_id, role, user, content, category]
    );

    console.log(`New message inserted into conversation ${conversation_id} for role ${role}`);

    return message.rows[0];
  }
  
export async function getCategoryIdByKey(client: PoolClient, key: string): Promise<string> {
    const result = await client.query('SELECT id FROM categories WHERE key = $1', [key]);

    console.log(`Category found by key: ${key}: ${result.rows[0]?.id}`);

    return result.rows[0]?.id;
  }

export async function ensureUser(client: PoolClient,user_id: string): Promise<string> {
  const result = await client.query('SELECT id FROM users WHERE id = $1', [user_id]);

  if (result.rows.length === 0) {
    const newUser = await client.query('INSERT INTO users(id) VALUES($1) RETURNING id', [user_id]);

    console.log(`New user created with ID: ${newUser.rows[0].id}`);

    return newUser.rows[0].id;
  } else {
    console.log(`User found by id: ${user_id}: ${result.rows[0]?.id}`);
    
    return result.rows[0].id;
  }
}