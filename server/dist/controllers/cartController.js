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
exports.removeCartItem = exports.getCartItems = exports.addToCart = void 0;
const cartService_1 = __importDefault(require("../services/cartService"));
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, courseId } = req.body;
        const response = yield cartService_1.default.addToCart(userId, courseId);
        res.status(response.status).json({ message: response.message });
    }
    catch (error) {
        console.error("Error adding course to cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addToCart = addToCart;
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.userId;
        if (studentId) {
            const cartItems = yield cartService_1.default.getCartItems(studentId);
            res.status(200).json(cartItems);
        }
    }
    catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getCartItems = getCartItems;
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItemId = req.params.cartItemId;
        const response = yield cartService_1.default.removeCartItem(cartItemId);
        res.status(response.status).json({ message: response.message });
    }
    catch (error) {
        console.error("Error removing course from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeCartItem = removeCartItem;
