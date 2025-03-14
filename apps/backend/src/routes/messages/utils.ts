import { Message } from "@shared/types";
import { PoolClient } from "pg";

export async function getMessagesByConversationId(clientDb: PoolClient, conversationId: string): Promise<Message[]> {
  const { rows } = await clientDb.query(
    `SELECT * FROM messages WHERE conversation_id = $1`,
    [conversationId]
  );

  console.log(`Messages found for conversation: ${conversationId}`);

  return rows;
}