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
exports.deleteCategory = exports.getUnblockedCategories = exports.getCategoriesPagination = exports.getCategories = exports.saveCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
/**
 * Add or Edit a category with subcategories
 */
const saveCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { categoryName, subCategories = [] } = req.body;
        if (!categoryName) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }
        if (id) {
            const category = yield Category_1.default.findById(id);
            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            category.categoryName = categoryName;
            category.subCategories = subCategories.map((name) => ({ name }));
            const updatedCategory = yield category.save();
            res.status(200).json(updatedCategory);
        }
        else {
            const newCategory = new Category_1.default({
                categoryName,
                subCategories: subCategories.map((name) => ({ name })),
                createdByAdmin: true,
            });
            const savedCategory = yield newCategory.save();
            res.status(201).json(savedCategory);
        }
    }
    catch (error) {
        console.error('Error saving category:', error);
        next({ status: 500, message: 'Error saving category', error });
    }
});
exports.saveCategory = saveCategory;
/**
 * Fetch all categories
 */
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        next({ status: 500, message: 'Error fetching categories', error });
    }
});
exports.getCategories = getCategories;
const getCategoriesPagination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    try {
        const totalCategories = yield Category_1.default.countDocuments();
        const categories = yield Category_1.default.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            categories,
            totalPages: Math.ceil(totalCategories / limit),
            currentPage: page,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoriesPagination = getCategoriesPagination;
/**
 * Fetch all Unblocked categories
 */
const getUnblockedCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find({ status: false });
        res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        next({ status: 500, message: 'Error fetching categories', error });
    }
});
exports.getUnblockedCategories = getUnblockedCategories;
/**
 * Delete a category
 */
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield Category_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        category.status = category.status ? false : true;
        const updatedCategory = yield category.save();
        res.status(200).json({
            message: `Category ${updatedCategory.status ? 'unblocked' : 'blocked'} successfully`,
            category: updatedCategory,
        });
    }
    catch (error) {
        console.error('Error blocking/unblocking category:', error);
        next({ status: 500, message: 'Error blocking/unblocking category', error });
    }
});
exports.deleteCategory = deleteCategory;
