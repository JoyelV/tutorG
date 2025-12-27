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
exports.getReviews = exports.addReview = void 0;
const reviewService_1 = __importDefault(require("../services/reviewService"));
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, material, comment } = req.body;
        const { courseId } = req.params;
        const response = yield reviewService_1.default.addReview(title, material, comment, courseId);
        res.status(response.status).json({ message: response.message });
    }
    catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error while submitting review' });
    }
});
exports.addReview = addReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const reviews = yield reviewService_1.default.getReviews(courseId);
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
});
exports.getReviews = getReviews;
