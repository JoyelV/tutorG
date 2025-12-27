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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const Category_1 = __importDefault(require("../models/Category"));
class CategoryRepository {
    // Save new category
    saveCategory(categoryName, subCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = new Category_1.default({
                categoryName,
                subCategories: subCategories.map((name) => ({ name })),
                createdByAdmin: true,
            });
            return yield newCategory.save();
        });
    }
    // Find a category by ID
    findCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.default.findById(id);
        });
    }
    // Find all categories with a specific condition
    findAllCategories(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.find(filter);
        });
    }
    findAllCategoriesFilter(filter, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.find(filter).skip((page - 1) * limit)
                .limit(limit);
        });
    }
    // Count documents
    countCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.default.countDocuments();
        });
    }
    // Save or update a category
    updateCategory(categoryId, categoryName, subCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.findCategoryById(categoryId);
            if (category) {
                category.categoryName = categoryName;
                category.subCategories = subCategories.map((name) => ({ name }));
                return yield category.save();
            }
            return null;
        });
    }
    // Block or unblock category
    toggleCategoryStatus(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.findCategoryById(categoryId);
            if (category) {
                category.status = !category.status;
                return yield category.save();
            }
            return null;
        });
    }
}
exports.CategoryRepository = CategoryRepository;
