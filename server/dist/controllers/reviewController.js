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
const Review_1 = __importDefault(require("../models/Review"));
const Course_1 = __importDefault(require("../models/Course"));
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, material, comment } = req.body;
        const { courseId } = req.params;
        const existingReview = yield Review_1.default.findOne({ courseId });
        if (existingReview) {
            res.status(200).json({
                message: 'A review already exists for this course.'
            });
            return;
        }
        const newReview = new Review_1.default({
            title,
            material,
            comment,
            courseId,
        });
        yield newReview.save();
        const course = yield Course_1.default.findById(courseId);
        if (course) {
            course.status = 'reviewed';
            yield course.save();
        }
        else {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(201).json({ message: 'Review submitted successfully!' });
    }
    catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error while submitting review' });
    }
});
exports.addReview = addReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const reviews = yield Review_1.default.find({ courseId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
});
exports.getReviews = getReviews;
