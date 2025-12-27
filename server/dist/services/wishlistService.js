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
const wishlistRepository_1 = __importDefault(require("../repositories/wishlistRepository"));
class WishlistService {
    addToWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemExisted = yield wishlistRepository_1.default.findItem(userId, courseId);
            if (itemExisted) {
                return { status: 200, message: "Course already existed in Wishlist" };
            }
            yield wishlistRepository_1.default.addItem(userId, courseId);
            return { status: 201, message: "Course added to wishlist successfully" };
        });
    }
    getWishlistItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlistRepository_1.default.getItemsByUser(userId);
        });
    }
    removeWishlistItem(wishlistItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const removedItem = yield wishlistRepository_1.default.removeItemById(wishlistItemId);
            if (!removedItem) {
                return { status: 404, message: "Wishlist item not found" };
            }
            return { status: 200, message: "Course removed from the wishlist" };
        });
    }
}
exports.default = new WishlistService();
