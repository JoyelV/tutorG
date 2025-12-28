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
exports.LessonService = void 0;
const lessonRepository_1 = require("../repositories/lessonRepository");
class LessonService {
    constructor() {
        this.lessonRepository = new lessonRepository_1.LessonRepository();
    }
    deleteLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!lessonId)
                throw new Error("Lesson ID is required.");
            const deletedLesson = yield this.lessonRepository.deleteLesson(lessonId);
            if (!deletedLesson)
                throw new Error("Lesson not found.");
            return { message: "Lesson deleted successfully." };
        });
    }
    getLessonsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lessonRepository.getLessonsByCourseId(courseId);
        });
    }
    getLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.lessonRepository.getLessonById(lessonId);
            if (!lesson)
                throw new Error("Lesson not found.");
            return lesson;
        });
    }
    updateLesson(lessonId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedLesson = yield this.lessonRepository.updateLesson(lessonId, updateData);
            if (!updatedLesson)
                throw new Error("Lesson not found.");
            return updatedLesson;
        });
    }
}
exports.LessonService = LessonService;
