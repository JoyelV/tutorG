"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const CourseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    language: { type: String },
    level: { type: String, required: true },
    duration: { type: Number, required: true },
    courseFee: { type: Number, required: true },
    thumbnail: { type: String, default: '' },
    trailer: { type: String, default: '' },
    description: { type: String, required: true },
    learningPoints: { type: String, required: true },
    targetAudience: { type: String, required: true },
    requirements: { type: String, required: true },
    instructorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    status: { type: String, enum: ['draft', 'reviewed', 'published', 'rejected'], default: 'draft' },
    createdAt: { type: Date, default: Date.now },
    students: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    ratingsAndFeedback: [
        {
            userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            feedback: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date },
        },
    ],
    averageRating: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
});
CourseSchema.methods.calculateAverageRating = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.ratingsAndFeedback.length === 0) {
            this.averageRating = 0;
        }
        else {
            const totalRating = this.ratingsAndFeedback.reduce((sum, entry) => sum + entry.rating, 0);
            this.averageRating = totalRating / this.ratingsAndFeedback.length;
        }
        yield this.save();
    });
};
const Course = mongoose_1.default.model('Course', CourseSchema);
exports.default = Course;
