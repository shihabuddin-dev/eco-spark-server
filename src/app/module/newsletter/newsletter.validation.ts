import z from 'zod';

export const subscribeValidation = z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email format'),
});

export const NewsletterValidation = {
    subscribeValidation,
};
