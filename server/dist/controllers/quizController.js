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
exports.QuizController = void 0;
const QuizService_1 = require("../services/QuizService");
class QuizController {
    constructor() {
        this.addQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { questions } = req.body;
                const { courseId } = req.params;
                const response = yield this.quizService.addQuiz(courseId, questions);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
            }
        });
        this.getQuizzesByCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            try {
                const response = yield this.quizService.getQuizzesByCourse(courseId);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to fetch quizzes.' });
            }
        });
        this.getQuizById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId, quizId } = req.params;
            try {
                const response = yield this.quizService.getQuizById(courseId, quizId);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to fetch quiz.' });
            }
        });
        this.updateQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId, quizId } = req.params;
            const { questions } = req.body;
            try {
                const response = yield this.quizService.updateQuiz(courseId, quizId, questions);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to update quiz.' });
            }
        });
        this.deleteQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId, quizId } = req.params;
            try {
                const response = yield this.quizService.deleteQuiz(courseId, quizId);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to delete quiz.' });
            }
        });
        this.submitQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { quizId, answers } = req.body;
            const userId = req.userId;
            try {
                if (userId) {
                    const response = yield this.quizService.submitQuiz(quizId, userId, answers);
                    res.status(response.status).json(response.message);
                }
            }
            catch (error) {
                res.status(500).json({ message: 'An error occurred while submitting the quiz.' });
            }
        });
        this.quizService = new QuizService_1.QuizService();
    }
}
exports.QuizController = QuizController;
