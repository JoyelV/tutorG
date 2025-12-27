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
exports.QuizService = void 0;
const QuizRepository_1 = require("../repositories/QuizRepository");
const quizResponseRepository_1 = require("../repositories/quizResponseRepository");
class QuizService {
    constructor() {
        this.quizRepository = new QuizRepository_1.QuizRepository();
        this.userQuizResponseRepository = new quizResponseRepository_1.UserQuizResponseRepository();
    }
    addQuiz(courseId, questions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(questions) || questions.length === 0) {
                return { status: 400, message: 'Quiz must contain at least one question.' };
            }
            for (const question of questions) {
                const { question: text, options, answer } = question;
                if (!text || !Array.isArray(options) || options.length !== 4 || !answer) {
                    return { status: 400, message: 'Each question must have a text, 4 options, and an answer.' };
                }
                if (!options.includes(answer)) {
                    return { status: 400, message: 'The answer must match one of the options.' };
                }
            }
            return this.quizRepository.addQuiz(courseId, questions);
        });
    }
    getQuizzesByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.getQuizzesByCourse(courseId);
        });
    }
    getQuizById(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.getQuizById(courseId, quizId);
        });
    }
    updateQuiz(courseId, quizId, questions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.updateQuiz(courseId, quizId, questions);
        });
    }
    deleteQuiz(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.deleteQuiz(courseId, quizId);
        });
    }
    submitQuiz(quizId, userId, answers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userQuizResponseRepository.submitQuiz(quizId, userId, answers);
        });
    }
}
exports.QuizService = QuizService;
