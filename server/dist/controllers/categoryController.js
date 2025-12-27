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
exports.deleteCategory = exports.getCategoriesPagination = exports.getCategories = exports.updateCategory = exports.saveCategory = void 0;
const categoryService_1 = require("../services/categoryService");
const categoryService = new categoryService_1.CategoryService();
/**
 * Add or Edit a category with subcategories
 */
const saveCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName, subCategories = [] } = req.body;
        if (!categoryName) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }
        const savedCategory = yield categoryService.saveCategory(categoryName, subCategories);
        res.status(201).json(savedCategory);
    }
    catch (error) {
        next({ status: 400, message: error.message });
    }
});
exports.saveCategory = saveCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { categoryName, subCategories = [] } = req.body;
        if (!categoryName) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }
        const updatedCategory = yield categoryService.updateCategory(id, categoryName, subCategories);
        if (!updatedCategory) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        next({ status: 400, message: error.message });
    }
});
exports.updateCategory = updateCategory;
/**
 * Fetch all categories
 */
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryService.getCategories();
        res.status(200).json(categories);
    }
    catch (error) {
        next({ status: 500, message: 'Error fetching categories', error });
    }
});
exports.getCategories = getCategories;
const getCategoriesPagination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    if (page < 1 || limit < 1) {
        res.status(400).json({ message: 'Page and limit must be positive integers.' });
        return;
    }
    try {
        const result = yield categoryService.getCategoriesPagination(page, limit);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoriesPagination = getCategoriesPagination;
/**
 * Block/Unblock a category
 */
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCategory = yield categoryService.toggleCategoryStatus(id);
        if (!updatedCategory) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json({
            message: `Category ${updatedCategory.status ? 'unblocked' : 'blocked'} successfully`,
            category: updatedCategory,
        });
    }
    catch (error) {
        next({ status: 500, message: 'Error blocking/unblocking category', error });
    }
});
exports.deleteCategory = deleteCategory;
