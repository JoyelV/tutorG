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
const Cart_1 = __importDefault(require("../models/Cart"));
const Orders_1 = __importDefault(require("../models/Orders"));
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, courseId } = req.body;
        const alreadyEnrolled = yield Orders_1.default.findOne({ courseId: courseId, studentId: userId });
        if (alreadyEnrolled) {
            res.status(200).json({ message: "Student is already enrolled in this course" });
            return;
        }
        const cartItemExisted = yield Cart_1.default.findOne({ user: userId, course: courseId });
        if (cartItemExisted) {
            res.status(200).json({ message: "Course already exists in the cart" });
            return;
        }
        const newCartItem = new Cart_1.default({ user: userId, course: courseId });
        yield newCartItem.save();
        res.status(201).json({ message: "Course added to cart successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addToCart = addToCart;
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.userId;
    try {
        const cartItems = yield Cart_1.default.find({ user: studentId })
            .populate('course')
            .lean();
        cartItems.forEach(item => {
            console.log('Populated Course:', item.course);
        });
        res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart items", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCartItems = getCartItems;
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItemId = req.params.cartItemId;
        const removedItem = yield Cart_1.default.findByIdAndDelete({ _id: cartItemId });
        if (!removedItem) {
            res.status(404).json({ error: "Cart item not found" });
            return;
        }
        res.status(200).json({ message: "Course removed from the cart" });
    }
    catch (error) {
        console.error("Error removing course from cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeCartItem = removeCartItem;
