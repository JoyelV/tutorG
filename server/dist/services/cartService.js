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
const cartRepository_1 = __importDefault(require("../repositories/cartRepository"));
class CartService {
    addToCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const alreadyEnrolled = yield cartRepository_1.default.findEnrollment(userId, courseId);
            if (alreadyEnrolled) {
                return { status: 200, message: "Student is already enrolled in this course" };
            }
            const cartItemExisted = yield cartRepository_1.default.findCartItem(userId, courseId);
            if (cartItemExisted) {
                return { status: 200, message: "Course already exists in the cart" };
            }
            yield cartRepository_1.default.addCartItem(userId, courseId);
            return { status: 201, message: "Course added to cart successfully" };
        });
    }
    getCartItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cartRepository_1.default.getCartItems(userId);
        });
    }
    removeCartItem(cartItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const removedItem = yield cartRepository_1.default.removeCartItem(cartItemId);
            if (!removedItem) {
                return { status: 404, message: "Cart item not found" };
            }
            return { status: 200, message: "Course removed from the cart" };
        });
    }
}
exports.default = new CartService();
