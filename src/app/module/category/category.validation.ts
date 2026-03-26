import z from 'zod';

export const createCategoryValidation = z.object({
    name: z.string({ error: 'Category name is required' }).min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
});

export const updateCategoryValidation = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: z.string().optional(),
});

export const CategoryValidation = {
    createCategoryValidation,
    updateCategoryValidation,
};
