import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30).optional(),
        email: z.string().email().optional(),
        phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
    }),
});

export const updatePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters long').regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    }),
});
