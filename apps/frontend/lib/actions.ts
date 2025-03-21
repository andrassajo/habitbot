'use server';

import { Categorie } from "@shared/types";
import { v4 as uuidv4 } from 'uuid';
import { ChatInputSchame, FormState } from "./types";
import { redirect } from "next/navigation";
import { getUserCookie } from "@/app/actions";

export async function getCategories(): Promise<Categorie[]> {
  const response = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/api/category/all`);
  const data = await response.json();

  return data.categories.filter((category: Categorie) => category.key !== 'default');
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

    const userId = await getUserCookie();

    const response = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validationFields.data,
        category_key,
        conversation_id: conversation_id || uuidv4(),
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
  const response = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/api/messages/${conversation_id}`);
  const data = await response.json();

  return data.messages
}

export async function getCategoryByKey(category_key: string) {
  const response = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/api/category/${category_key}`);
  const data = await response.json();

  return data.category;
}

export async function getConversationById(id: string) {
  const response = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/api/conversations/${id}`);
  const data = await response.json();

  return data.conversation;
}

export async function getConversationsByUser() {
  const userId = await getUserCookie();

  const response = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/api/conversations/by-user/${userId}`);
  const data = await response.json();

  return data.conversations;
}