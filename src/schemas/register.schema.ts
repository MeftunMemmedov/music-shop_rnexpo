import z from 'zod';

export const registerSchema = z
  .object({
    email: z.email('Invalid email').transform((val) => val.trim()),
    password: z
      .string()
      .min(6, ' Min 6 chars')
      .transform((val) => val.trim()),
    confirmPassword: z.string(),
    data: z.object({
      user_name: z
        .string()
        .min(3, 'Username is too short')
        .transform((val) => val.trim()),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords dont match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
