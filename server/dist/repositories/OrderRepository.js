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
exports.OrderRepository = void 0;
const Orders_1 = __importDefault(require("../models/Orders"));
class OrderRepository {
    findOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default.find({ studentId: userId }).populate("courseId", "title thumbnail courseFee level");
        });
    }
    findEnrolledOrders(userId, page, limit, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const sortOptions = {};
            sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
            return yield Orders_1.default.find({ studentId: userId })
                .populate('courseId', 'title')
                .populate('tutorId', 'username')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
        });
    }
    countOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default.countDocuments({ studentId: userId });
        });
    }
    findOrders(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default
                .find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("studentId", "username")
                .populate("tutorId", "username")
                .populate("courseId", "title category");
        });
    }
    countAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default.countDocuments();
        });
    }
    countTotalOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default.find();
        });
    }
    findOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default
                .findById(orderId)
                .populate("studentId", "username email image")
                .populate("courseId", "title subtitle subCategory language thumbnail description")
                .populate("tutorId", "username email image");
        });
    }
    findOrdersBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default
                .find({ sessionId })
                .populate("studentId", "username email image")
                .populate("courseId", "title subtitle subCategory language thumbnail description")
                .populate("tutorId", "username email image");
        });
    }
    getOrdersByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Orders_1.default
                .find({ studentId })
                .populate('tutorId', 'username image onlineStatus')
                .exec();
        });
    }
}
exports.OrderRepository = OrderRepository;
