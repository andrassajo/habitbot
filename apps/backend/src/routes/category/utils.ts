import { Categorie } from "@shared/types";
import { PoolClient } from "pg";

export async function getAllCategories(clientDb: PoolClient): Promise<[Categorie[]]> {
  const { rows } = await clientDb.query<any>('SELECT * FROM categories');

  return rows;
}

export async function getCategoryByKey(clientDb: PoolClient, key: string): Promise<Categorie> {
  const { rows } = await clientDb.query<any>('SELECT * FROM categories WHERE key = $1', [key]);

  return rows[0];
}