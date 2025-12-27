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
const Cart_1 = __importDefault(require("../models/Cart"));
const Orders_1 = __importDefault(require("../models/Orders"));
class CartRepository {
    findEnrollment(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default.findOne({ courseId, studentId: userId });
        });
    }
    findCartItem(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cart_1.default.findOne({ user: userId, course: courseId });
        });
    }
    addCartItem(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCartItem = new Cart_1.default({ user: userId, course: courseId });
            return yield newCartItem.save();
        });
    }
    getCartItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cart_1.default.find({ user: userId }).populate('course').lean();
        });
    }
    removeCartItem(cartItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Cart_1.default.findByIdAndDelete({ _id: cartItemId });
        });
    }
}
exports.default = new CartRepository();
