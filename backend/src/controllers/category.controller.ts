import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Category } from '../models/Category';
import { AppError } from '../utils/AppError';

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ data: categories });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const exists = await Category.findOne({ slug: payload.slug });
  if (exists) {
    throw new AppError('Slug already exists', 409);
  }

  const category = await Category.create(payload);
  res.status(201).json({ data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const category = await Category.findOneAndUpdate({ category_id: categoryId }, req.body, {
    new: true
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.json({ data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const category = await Category.findOneAndDelete({ category_id: categoryId });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  res.status(204).send();
});
