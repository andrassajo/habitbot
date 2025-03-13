'use server';

import { Categorie } from "@shared/types";

export async function getCategories(): Promise<Categorie[]> {
  const response = await fetch(`${process.env['BACKEND_URL']}/api/category/all`);
  const data = await response.json();

  return data.categories;
}