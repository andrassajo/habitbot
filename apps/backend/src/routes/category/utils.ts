import { Categorie } from "@shared/types";
import { PoolClient } from "pg";

export async function getAllCategories(clientDb: PoolClient): Promise<[Categorie[]]> {
  const { rows } = await clientDb.query<any>('SELECT * FROM categories');

  return rows;
}