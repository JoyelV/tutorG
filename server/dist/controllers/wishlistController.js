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
exports.removeWishlistItem = exports.getWishlistItems = exports.addToWishlist = void 0;
const wishlist_1 = __importDefault(require("../models/wishlist"));
const addToWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, courseId } = req.body;
        const itemExisted = yield wishlist_1.default.findOne({ user: userId, course: courseId });
        if (itemExisted) {
            res.status(200).json({ message: "Course already existed in Wishlist" });
            return;
        }
        else {
            const newItem = new wishlist_1.default({ user: userId, course: courseId });
            yield newItem.save();
            res.status(201).json({ message: "Course added to wishlist successfully" });
            return;
        }
    }
    catch (error) {
        console.error("Error Occur while Adding to wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addToWishlist = addToWishlist;
const getWishlistItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.userId;
    try {
        const wishlistItems = yield wishlist_1.default.find({ user: studentId }).populate("course");
        wishlistItems.forEach(item => {
            console.log('Populated Course:', item.course);
        });
        res.status(200).json(wishlistItems);
    }
    catch (error) {
        console.error("Error fetching cart Items", error);
        res.status(500).json({ error: "Internal server Error" });
    }
});
exports.getWishlistItems = getWishlistItems;
const removeWishlistItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlistItemId = req.params.wishlistItemId;
        const removedItem = yield wishlist_1.default.findByIdAndDelete({ _id: wishlistItemId });
        if (!removedItem) {
            res.status(404).json({ error: "Wishlist item not found" });
            return;
        }
        res.status(200).json({ message: "Course removed from the wishlist" });
    }
    catch (error) {
        console.error("Error removing course from wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeWishlistItem = removeWishlistItem;
