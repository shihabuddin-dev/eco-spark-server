import z from 'zod';

export const createCommentValidation = z.object({
    content: z.string({ error: 'Comment content is required' }).min(1, 'Comment cannot be empty'),
    parentId: z.string().uuid().optional(),
});

export const updateCommentValidation = z.object({
    content: z.string({ error: 'Comment content is required' }).min(1, 'Comment cannot be empty'),
});

export const CommentValidation = {
    createCommentValidation,
    updateCommentValidation,
};
