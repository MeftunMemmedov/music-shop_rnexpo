import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address').transform((val) => val.trim()),
  password: z
    .string()
    .min(6, 'Password must be minimum 6 characters')
    .transform((val) => val.trim()),
});

export type LoginInput = z.infer<typeof loginSchema>;
