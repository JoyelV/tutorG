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
exports.getViewChapter = exports.getViewChapters = exports.deleteLesson = void 0;
const lessonService_1 = require("../services/lessonService");
const lessonService = new lessonService_1.LessonService();
const deleteLesson = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.body;
        const result = yield lessonService.deleteLesson(lessonId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteLesson = deleteLesson;
const getViewChapters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const lessons = yield lessonService.getLessonsByCourseId(courseId);
        res.status(200).json(lessons);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getViewChapters = getViewChapters;
const getViewChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.params;
        const lesson = yield lessonService.getLessonById(lessonId);
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getViewChapter = getViewChapter;
