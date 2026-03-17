import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

const categoryService = new CategoryService();

/**
 * Add or Edit a category with subcategories
 */
export const saveCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { categoryName, subCategories = [] } = req.body;
  if (!categoryName) {
    throw new AppError(400, 'Category name is required');
  }

  const savedCategory = await categoryService.saveCategory(categoryName, subCategories);
  res.status(201).json(new ApiResponse(201, savedCategory, 'Category saved successfully'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { categoryName, subCategories = [] } = req.body;

  if (!categoryName) {
    throw new AppError(400, 'Category name is required');
  }

  const updatedCategory = await categoryService.updateCategory(id, categoryName, subCategories);
  if (!updatedCategory) {
    throw new AppError(404, 'Category not found');
  }
  res.status(200).json(new ApiResponse(200, updatedCategory, 'Category updated successfully'));
});

/**
 * Fetch all categories
 */
export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await categoryService.getCategories();
  res.status(200).json(new ApiResponse(200, categories));
});

export const getCategoriesPagination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 5;

  if (page < 1 || limit < 1) {
    throw new AppError(400, 'Page and limit must be positive integers');
  }

  const result = await categoryService.getCategoriesPagination(page, limit);
  res.status(200).json(new ApiResponse(200, result));
});

/**
 * Block/Unblock a category
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedCategory = await categoryService.toggleCategoryStatus(id);
  if (!updatedCategory) {
    throw new AppError(404, 'Category not found');
  }
  res.status(200).json(new ApiResponse(200, updatedCategory, `Category ${updatedCategory.status ? 'unblocked' : 'blocked'} successfully`));
});
