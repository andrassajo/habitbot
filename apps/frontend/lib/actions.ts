'use server';

import { Categorie } from "@shared/types";
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { ChatInputSchame, FormState } from "./types";
import { redirect } from "next/navigation";

export async function getCategories(): Promise<Categorie[]> {
  const response = await fetch(`${process.env['BACKEND_URL']}/api/category/all`);
  const data = await response.json();

  return data.categories.filter((category: Categorie) => category.key !== 'default');
}

const COOKIE_NAME = 'userId';

export async function ensureUserCookie(): Promise<string> {
  const userId = (await cookies()).get(COOKIE_NAME)?.value;

  if (!userId) {
    const newUserId = uuidv4();

    (await cookies()).set('userId', newUserId, {
      httpOnly: true,
      path: '/',
    });

    return newUserId;
  }
  
  return userId;
}


export async function sendMessage(
  state: FormState,
  formData: FormData,
  category_key: string,
  conversation_id?: string,
) {
  const validationFields = ChatInputSchame.safeParse({
    message: formData.get("message"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

    const userId = await ensureUserCookie();

    const response = await fetch(`${process.env['BACKEND_URL']}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validationFields.data,
        category_key,
        conversation_id,
        user_id: userId
      }),
    })
  
    const data = await response.json();
  
    if (data.success && !conversation_id) {
      redirect(`/${category_key}/${data.conversation_id}`);
    } else
      return {
        message: "Something went wrong. Please try again later.",
      };
}

export async function getMessages(conversation_id: string) {
  const response = await fetch(`${process.env['BACKEND_URL']}/api/messages/${conversation_id}`);
  const data = await response.json();

  return data.messages
}