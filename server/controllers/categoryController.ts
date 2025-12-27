import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';

const categoryService = new CategoryService();

/**
 * Add or Edit a category with subcategories
 */
export const saveCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryName, subCategories = [] } = req.body;
    if (!categoryName) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    const savedCategory = await categoryService.saveCategory(categoryName, subCategories);
    res.status(201).json(savedCategory);
  } catch (error:any) {
    next({ status: 400, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { categoryName, subCategories = [] } = req.body;

    if (!categoryName) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    const updatedCategory = await categoryService.updateCategory(id, categoryName, subCategories);
    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(updatedCategory);
  } catch (error:any) {
    next({ status: 400, message: error.message });
  }
};

/**
 * Fetch all categories
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const getCategoriesPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 5;

  if (page < 1 || limit < 1) {
    res.status(400).json({ message: 'Page and limit must be positive integers.' });
    return ;
  }

  try {
    const result = await categoryService.getCategoriesPagination(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Block/Unblock a category
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.toggleCategoryStatus(id);
    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json({
      message: `Category ${updatedCategory.status ? 'unblocked' : 'blocked'} successfully`,
      category: updatedCategory,
    });
  } catch (error) {
    next({ status: 500, message: 'Error blocking/unblocking category', error });
  }
};
