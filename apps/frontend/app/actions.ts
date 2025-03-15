'use server';

import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'userId';

export async function getUserCookie(): Promise<string | undefined> {
    return (await cookies()).get(COOKIE_NAME)?.value;
}

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
