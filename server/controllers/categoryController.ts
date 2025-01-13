import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

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

    const newCategory = new Category({
        categoryName,
        subCategories: subCategories.map((name: string) => ({ name })),
        createdByAdmin: true,
      });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    
  } catch (error) {
    console.error('Error saving category:', error);
    next({ status: 500, message: 'Error saving category', error });
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

    if (id) {
      const category = await Category.findById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      category.categoryName = categoryName;
      category.subCategories = subCategories.map((name: string) => ({ name }));
      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
    } 
  } catch (error) {
    console.error('Error saving category:', error);
    next({ status: 500, message: 'Error saving category', error });
  }
};

/**
 * Fetch all categories
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({status:false});
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const getCategoriesPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 5;

  if (page < 1 || limit < 1) {
    res.status(400).json({ error: "Page and limit must be positive integers." });
    return;
  }

  try {
    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    if ((page - 1) * limit >= totalCategories) {
      res.status(200).json({
        categories: [],
        totalPages,
        currentPage: page,
      });
      return;
    }

    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      categories,
      totalPages,
      currentPage: page,
      totalItems: totalCategories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch all Unblocked categories
 */
export const getUnblockedCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({ status: false });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};


/**
 * Delete a category
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    category.status = category.status ? false : true;
    const updatedCategory = await category.save();

    res.status(200).json({
      message: `Category ${updatedCategory.status ? 'unblocked' : 'blocked'} successfully`,
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Error blocking/unblocking category:', error);
    next({ status: 500, message: 'Error blocking/unblocking category', error });
  }
};
