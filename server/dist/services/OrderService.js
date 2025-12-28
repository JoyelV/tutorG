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
exports.OrderService = void 0;
const orderRepository_1 = require("../repositories/orderRepository");
class OrderService {
    constructor() {
        this.orderRepository = new orderRepository_1.OrderRepository();
    }
    getUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw new Error("User ID is required");
            return yield this.orderRepository.findOrdersByUserId(userId);
        });
    }
    getEnrolledOrders(userId, page, limit, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.findEnrolledOrders(userId, page, limit, sortBy, sortDirection);
        });
    }
    getOrders(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.findOrders(page, limit);
        });
    }
    getOrderDetail(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.findOrderById(orderId);
        });
    }
    getOrdersBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.findOrdersBySessionId(sessionId);
        });
    }
    countUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.countOrdersByUserId(userId);
        });
    }
    countTotalOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.countAllOrders();
        });
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.countTotalOrders();
        });
    }
    getMyTutorsService(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.getOrdersByStudentId(studentId);
            const uniqueOrders = orders.filter((order, index, self) => index === self.findIndex((o) => o.tutorId.toString() === order.tutorId.toString()));
            return uniqueOrders;
        });
    }
}
exports.OrderService = OrderService;
