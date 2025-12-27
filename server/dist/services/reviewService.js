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
const reviewRepository_1 = __importDefault(require("../repositories/reviewRepository"));
class ReviewService {
    addReview(title, material, comment, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingReview = yield reviewRepository_1.default.findReviewByCourseId(courseId);
            if (existingReview) {
                return { status: 200, message: 'A review already exists for this course.' };
            }
            yield reviewRepository_1.default.addReview(title, material, comment, courseId);
            const course = yield reviewRepository_1.default.findCourseById(courseId);
            if (!course) {
                return { status: 404, message: 'Course not found' };
            }
            yield reviewRepository_1.default.updateCourseStatus(courseId, 'reviewed');
            return { status: 201, message: 'Review submitted successfully!' };
        });
    }
    getReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield reviewRepository_1.default.getReviewsByCourseId(courseId);
        });
    }
}
exports.default = new ReviewService();
