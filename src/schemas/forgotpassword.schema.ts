import z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address').transform((val) => val.trim()),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, 'Password must be minimum 6 characters')
    .transform((val) => val.trim()),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
