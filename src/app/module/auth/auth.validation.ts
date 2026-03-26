import z from 'zod';

export const registerValidation = z.object({
    name: z.string({ error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ error: 'Email is required' }).email('Invalid email format'),
    password: z.string({ error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    profileImage: z.string().url().optional(),
});

export const loginValidation = z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email format'),
    password: z.string({ error: 'Password is required' }),
});

export const changePasswordValidation = z.object({
    currentPassword: z.string({ error: 'Current password is required' }),
    newPassword: z.string({ error: 'New password is required' }).min(6, 'Password must be at least 6 characters'),
});

export const AuthValidation = {
    registerValidation,
    loginValidation,
    changePasswordValidation,
};
