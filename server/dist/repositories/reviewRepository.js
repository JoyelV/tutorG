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
const Review_1 = __importDefault(require("../models/Review"));
const Course_1 = __importDefault(require("../models/Course"));
class ReviewRepository {
    findReviewByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Review_1.default.findOne({ courseId });
        });
    }
    addReview(title, material, comment, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newReview = new Review_1.default({ title, material, comment, courseId });
            return yield newReview.save();
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.default.findById(courseId);
        });
    }
    updateCourseStatus(courseId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.default.findByIdAndUpdate(courseId, { status }, { new: true });
        });
    }
    getReviewsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Review_1.default.find({ courseId }).sort({ createdAt: -1 });
        });
    }
}
exports.default = new ReviewRepository();
