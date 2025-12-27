"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
class CategoryService {
    constructor() {
        this.categoryRepository = new categoryRepository_1.CategoryRepository();
    }
    // Add or edit a category with subcategories
    saveCategory(categoryName, subCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategoryNames = subCategories.map((sub) => sub.trim().toLowerCase());
            const hasDuplicateSubcategories = new Set(subCategoryNames).size !== subCategoryNames.length;
            if (hasDuplicateSubcategories) {
                throw new Error('Duplicate subcategories are not allowed');
            }
            return yield this.categoryRepository.saveCategory(categoryName, subCategories);
        });
    }
    // Update a category
    updateCategory(id, categoryName, subCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategoryNames = subCategories.map((sub) => sub.trim().toLowerCase());
            const hasDuplicateSubcategories = new Set(subCategoryNames).size !== subCategoryNames.length;
            if (hasDuplicateSubcategories) {
                throw new Error('Duplicate subcategories are not allowed');
            }
            return yield this.categoryRepository.updateCategory(id, categoryName, subCategories);
        });
    }
    // Fetch all categories
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findAllCategories({ status: false });
        });
    }
    getCategoriesPagination(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryRepository
                .findAllCategoriesFilter({}, page, limit);
            const totalCategories = yield this.categoryRepository.countCategories();
            const totalPages = Math.ceil(totalCategories / limit);
            return {
                categories,
                totalPages,
                currentPage: page,
                totalItems: totalCategories,
            };
        });
    }
    // Block or unblock category
    toggleCategoryStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.toggleCategoryStatus(id);
        });
    }
}
exports.CategoryService = CategoryService;
