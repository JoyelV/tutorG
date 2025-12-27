import { CategoryRepository } from '../repositories/categoryRepository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  // Add or edit a category with subcategories
  async saveCategory(categoryName: string, subCategories: string[]) {
    const subCategoryNames = subCategories.map((sub: string) => sub.trim().toLowerCase());
    const hasDuplicateSubcategories = new Set(subCategoryNames).size !== subCategoryNames.length;
    if (hasDuplicateSubcategories) {
      throw new Error('Duplicate subcategories are not allowed');
    }
    return await this.categoryRepository.saveCategory(categoryName, subCategories);
  }

  // Update a category
  async updateCategory(id: string, categoryName: string, subCategories: string[]) {
    const subCategoryNames = subCategories.map((sub: string) => sub.trim().toLowerCase());
    const hasDuplicateSubcategories = new Set(subCategoryNames).size !== subCategoryNames.length;
    if (hasDuplicateSubcategories) {
      throw new Error('Duplicate subcategories are not allowed');
    }
    return await this.categoryRepository.updateCategory(id, categoryName, subCategories);
  }

  // Fetch all categories
  async getCategories() {
    return await this.categoryRepository.findAllCategories({ status: false });
  }

  async getCategoriesPagination(page: number, limit: number) {
    const categories = await this.categoryRepository
      .findAllCategoriesFilter({},page,limit);
  
    const totalCategories = await this.categoryRepository.countCategories();
    const totalPages = Math.ceil(totalCategories / limit);
  
    return {
      categories,
      totalPages,
      currentPage: page,
      totalItems: totalCategories,
    };
  }  

  // Block or unblock category
  async toggleCategoryStatus(id: string) {
    return await this.categoryRepository.toggleCategoryStatus(id);
  }
}
