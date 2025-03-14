import { Conversation } from "@shared/types";
import { PoolClient } from "pg";



export async function getConversationsByUser(clientDb: PoolClient, user: string): Promise<(Pick<Conversation, 'id' | 'title'> & { categoryname: string, categorykey: string })[]> {
  const { rows } = await clientDb.query<any>(
    `SELECT conv.id, conv.title, cat.name as categoryname, cat.key as categorykey
    FROM conversations as conv
    LEFT JOIN categories as cat ON conv.category_id = cat.id
    WHERE conv.user_id = $1`,
    [user]
  );

  return rows;
}