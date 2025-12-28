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
exports.LessonRepository = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
class LessonRepository {
    deleteLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.findByIdAndDelete(lessonId);
        });
    }
    getLessonsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.find({ courseId });
        });
    }
    getLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.findById(lessonId);
        });
    }
    updateLesson(lessonId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.findByIdAndUpdate(lessonId, updateData, { new: true });
        });
    }
}
exports.LessonRepository = LessonRepository;
