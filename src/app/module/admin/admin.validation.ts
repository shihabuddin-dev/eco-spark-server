import z from 'zod';

export const rejectIdeaValidation = z.object({
    feedback: z.string({ error: 'Feedback is required when rejecting an idea' }).min(5, 'Feedback must be at least 5 characters'),
});

export const updateUserStatusValidation = z.object({
    status: z.enum(['ACTIVE', 'DEACTIVATED'], { error: 'Status is required' }),
});

export const updateUserRoleValidation = z.object({
    role: z.enum(['MEMBER', 'ADMIN'], { error: 'Role is required' }),
});

export const AdminValidation = {
    rejectIdeaValidation,
    updateUserStatusValidation,
    updateUserRoleValidation,
};
