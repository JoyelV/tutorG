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
const wishlistService_1 = __importDefault(require("../services/wishlistService"));
const addToWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, courseId } = req.body;
        const response = yield wishlistService_1.default.addToWishlist(userId, courseId);
        res.status(response.status).json({ message: response.message });
    }
    catch (error) {
        console.error("Error Occurred while Adding to Wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addToWishlist = addToWishlist;
const getWishlistItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.userId;
        if (studentId) {
            const wishlistItems = yield wishlistService_1.default.getWishlistItems(studentId);
            res.status(200).json(wishlistItems);
        }
    }
    catch (error) {
        console.error("Error Fetching Wishlist Items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getWishlistItems = getWishlistItems;
const removeWishlistItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlistItemId = req.params.wishlistItemId;
        const response = yield wishlistService_1.default.removeWishlistItem(wishlistItemId);
        res.status(response.status).json({ message: response.message });
    }
    catch (error) {
        console.error("Error Removing Wishlist Item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeWishlistItem = removeWishlistItem;
