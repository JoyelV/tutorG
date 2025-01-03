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
exports.getOrdersBySessionId = exports.getOrderDetail = exports.getOrders = exports.getEnrolledOrders = exports.getUserOrders = void 0;
const Orders_1 = __importDefault(require("../models/Orders"));
const getUserOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        if (!userId) {
            res.status(400).json({ message: "User ID is required and must be a string" });
            return;
        }
        const orders = yield Orders_1.default.find({
            studentId: userId
        }).populate("courseId", "title thumbnail courseFee level");
        if (!orders || orders.length === 0) {
            res.status(404).json({ message: "No orders found for this user" });
            return;
        }
        res.status(200).json(orders);
        return;
    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.getUserOrders = getUserOrders;
const getEnrolledOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const sortBy = req.query.sort || 'createdAt';
        const sortDirection = req.query.direction || 'desc';
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
        const orders = yield Orders_1.default.find({ studentId: userId })
            .populate('courseId', 'title')
            .populate('tutorId', 'username')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        const totalOrders = yield Orders_1.default.countDocuments({ studentId: userId });
        const totalPages = Math.ceil(totalOrders / limit);
        if (orders.length === 0) {
            res.status(204).json({ message: 'No purchase history found' });
            return;
        }
        res.status(200).json({
            orders,
            currentPage: page,
            totalPages: totalPages,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getEnrolledOrders = getEnrolledOrders;
/**
 * Get all orders with pagination
 * @route GET /api/orders
 */
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    try {
        const [orders, totalOrders] = yield Promise.all([
            Orders_1.default
                .find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("studentId", "username")
                .populate("tutorId", "username")
                .populate("courseId", "title category"),
            Orders_1.default.countDocuments(),
        ]);
        const total = yield Orders_1.default.find();
        res.status(200).json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            total
        });
    }
    catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
});
exports.getOrders = getOrders;
const getOrderDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const order = yield Orders_1.default
            .findById(orderId)
            .populate("studentId", "username email image")
            .populate("courseId", "title subtitle subCategory language thumbnail description")
            .populate("tutorId", "username email image");
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});
exports.getOrderDetail = getOrderDetail;
const getOrdersBySessionId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { session_id } = req.query;
    if (!session_id) {
        res.status(400).json({ message: "Session ID is required." });
        return;
    }
    try {
        const orders = yield Orders_1.default
            .find({ sessionId: session_id })
            .populate("studentId", "username email image")
            .populate("courseId", "title subtitle subCategory language thumbnail description")
            .populate("tutorId", "username email image");
        if (!orders.length) {
            res.status(404).json({ message: "No orders found for the given session ID." });
            return;
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getOrdersBySessionId = getOrdersBySessionId;
