import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

const createCategory = async (payload: { name: string; description?: string }) => {
    const existing = await prisma.category.findUnique({ where: { name: payload.name } });
    if (existing) {
        throw new AppError(status.CONFLICT, 'Category with this name already exists');
    }

    const category = await prisma.category.create({ data: payload });
    return category;
};

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { ideas: true },
            },
        },
    });
    return categories;
};

const updateCategory = async (id: string, payload: { name?: string; description?: string }) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        throw new AppError(status.NOT_FOUND, 'Category not found');
    }

    if (payload.name && payload.name !== category.name) {
        const existing = await prisma.category.findUnique({ where: { name: payload.name } });
        if (existing) {
            throw new AppError(status.CONFLICT, 'Category with this name already exists');
        }
    }

    const updated = await prisma.category.update({ where: { id }, data: payload });
    return updated;
};

const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        throw new AppError(status.NOT_FOUND, 'Category not found');
    }

    // Check if any ideas are using this category
    const ideaCount = await prisma.idea.count({ where: { categoryId: id } });
    if (ideaCount > 0) {
        throw new AppError(status.BAD_REQUEST, `Cannot delete category. ${ideaCount} ideas are using this category.`);
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
