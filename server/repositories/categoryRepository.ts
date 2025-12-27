import Category from '../models/Category';

export class CategoryRepository {
  // Save new category
  async saveCategory(categoryName: string, subCategories: string[]) {
    const newCategory = new Category({
      categoryName,
      subCategories: subCategories.map((name: string) => ({ name })),
      createdByAdmin: true,
    });
    return await newCategory.save();
  }

  // Find a category by ID
  async findCategoryById(id: string) {
    return await Category.findById(id);
  }

  // Find all categories with a specific condition
  async findAllCategories(filter: object) {
    return Category.find(filter);
  }

  async findAllCategoriesFilter(filter: object,page:number,limit:number) {
    return Category.find(filter).skip((page - 1) * limit)  
    .limit(limit);  
  }

  // Count documents
  async countCategories() {
    return await Category.countDocuments();
  }

  // Save or update a category
  async updateCategory(categoryId: string, categoryName: string, subCategories: string[]) {
    const category = await this.findCategoryById(categoryId);
    if (category) {
      category.categoryName = categoryName;
      category.subCategories = subCategories.map((name: string) => ({ name }));
      return await category.save();
    }
    return null;
  }

  // Block or unblock category
  async toggleCategoryStatus(categoryId: string) {
    const category = await this.findCategoryById(categoryId);
    if (category) {
      category.status = !category.status;
      return await category.save();
    }
    return null;
  }
}
