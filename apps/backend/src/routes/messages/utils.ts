import { Message } from "@shared/types";
import { PoolClient } from "pg";

export async function getMessagesByConversationId(clientDb: PoolClient, conversationId: string): Promise<Message[]> {
  const { rows } = await clientDb.query(
    `SELECT * FROM messages WHERE conversation_id = $1`,
    [conversationId]
  );

  if (rows.length === 0) {
    console.log(`No messages found for conversation: ${conversationId}`);
  }

  return rows
}