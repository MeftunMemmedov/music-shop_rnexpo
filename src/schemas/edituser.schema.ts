import z from 'zod';

export const editUserSchema = z.object({
  user_id: z.string(),
  email: z.email('Invalid email').transform((val) => val.trim()),
  data: z.object({
    user_name: z
      .string()
      .min(3, 'Username is too short')
      .transform((val) => val.trim()),
  }),
  provider: z.enum(['google', 'email']),
});

export type EditUserInput = z.infer<typeof editUserSchema>;
