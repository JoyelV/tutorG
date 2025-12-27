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
const wishlist_1 = __importDefault(require("../models/wishlist"));
class WishlistRepository {
    findItem(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlist_1.default.findOne({ user: userId, course: courseId });
        });
    }
    addItem(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = new wishlist_1.default({ user: userId, course: courseId });
            return yield newItem.save();
        });
    }
    getItemsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlist_1.default.find({ user: userId }).populate("course");
        });
    }
    removeItemById(wishlistItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlist_1.default.findByIdAndDelete(wishlistItemId);
        });
    }
}
exports.default = new WishlistRepository();
