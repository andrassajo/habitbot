import { z } from 'zod';

export type FormState = {
  error?: {
      message?: string[];
  }
  message?: string;
} | undefined

export const ChatInputSchame = z.object({
    message: z
        .string()
        .min(1, 'Message must be at least 1 character long')
        .trim()

})
