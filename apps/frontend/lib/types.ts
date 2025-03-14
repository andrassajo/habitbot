import { z } from 'zod';

export type FormState = {
  error?: {
      message?: string[];
  }
  message?: string;
} | undefined

export const ChatInputSchame = z.object({
    message: z.string().trim()

})
