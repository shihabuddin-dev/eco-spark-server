import z from 'zod';

export const createIdeaValidation = z.object({
    title: z.string({ error: 'Title is required' }).min(5, 'Title must be at least 5 characters'),
    problemStatement: z.string({ error: 'Problem statement is required' }).min(10, 'Problem statement must be at least 10 characters'),
    proposedSolution: z.string({ error: 'Proposed solution is required' }).min(10, 'Proposed solution must be at least 10 characters'),
    description: z.string({ error: 'Description is required' }).min(20, 'Description must be at least 20 characters'),
    images: z.array(z.string().url()).optional().default([]),
    isPaid: z.boolean().optional().default(false),
    price: z.number().positive('Price must be positive').optional(),
    categoryId: z.string({ error: 'Category is required' }),
});

export const updateIdeaValidation = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').optional(),
    problemStatement: z.string().min(10).optional(),
    proposedSolution: z.string().min(10).optional(),
    description: z.string().min(20).optional(),
    images: z.array(z.string().url()).optional(),
    isPaid: z.boolean().optional(),
    price: z.number().positive('Price must be positive').optional().nullable(),
    categoryId: z.string().optional(),
    status: z.enum(['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).optional(),
});

export const IdeaValidation = {
    createIdeaValidation,
    updateIdeaValidation,
};
