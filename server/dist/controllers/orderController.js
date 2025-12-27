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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../services/OrderService");
class OrderController {
    constructor() {
        this.orderService = new OrderService_1.OrderService();
    }
    getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!userId) {
                    res.status(404).json({ message: "No user found" });
                    return;
                }
                const orders = yield this.orderService.getUserOrders(userId);
                if (!orders || orders.length === 0) {
                    res.status(404).json({ message: "No orders found for this user" });
                    return;
                }
                res.status(200).json(orders);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEnrolledOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 8;
                const sortBy = req.query.sort || 'createdAt';
                const sortDirection = req.query.direction || 'desc';
                if (!userId) {
                    res.status(404).json({ message: "No user found" });
                    return;
                }
                const orders = yield this.orderService.getEnrolledOrders(userId, page, limit, sortBy, sortDirection);
                const totalOrders = yield this.orderService.countUserOrders(userId);
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
                next(err);
            }
        });
    }
    getOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 5;
                const orders = yield this.orderService.getOrders(page, limit);
                const totalOrders = yield this.orderService.countTotalOrders();
                const total = yield this.orderService.countTotal();
                const totalPages = Math.ceil(totalOrders / limit);
                res.status(200).json({
                    orders,
                    totalPages: totalPages,
                    currentPage: page,
                    total
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOrderDetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const order = yield this.orderService.getOrderDetail(orderId);
                if (!order) {
                    res.status(404).json({ message: "Order not found" });
                    return;
                }
                res.status(200).json({ order });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOrdersBySessionId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { session_id } = req.query;
                if (!session_id) {
                    res.status(400).json({ message: "Session ID is required" });
                    return;
                }
                const orders = yield this.orderService.getOrdersBySessionId(session_id);
                if (!orders || orders.length === 0) {
                    res.status(404).json({ message: "No orders found for the given session ID" });
                    return;
                }
                res.status(200).json({ orders });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.OrderController = OrderController;
