import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

/**
 * Add or Edit a category with subcategories
 */
export const saveCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; 
    const { categoryName, subCategories = [] } = req.body;

    if (!categoryName) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    if (id) {
      // Edit category
      const category = await Category.findById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      category.categoryName = categoryName;
      console.log(categoryName)
      category.subCategories = subCategories.map((name: string) => ({ name }));
      console.log(category.subCategories,"subcategories data.........")
      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
    } else {
      // Create category
      const newCategory = new Category({
        categoryName,
        subCategories: subCategories.map((name: string) => ({ name })),
        createdByAdmin: true,
      });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
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
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const getCategoriesPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  try {
    const totalCategories = await Category.countDocuments();
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.status(200).json({
      categories,
      totalPages: Math.ceil(totalCategories / limit),
      currentPage: page,
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
