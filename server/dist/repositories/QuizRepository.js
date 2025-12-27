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
exports.QuizRepository = void 0;
const Quiz_1 = __importDefault(require("../models/Quiz"));
class QuizRepository {
    addQuiz(courseId, questions) {
        return __awaiter(this, void 0, void 0, function* () {
            const newQuiz = new Quiz_1.default({ questions, courseId });
            const savedQuiz = yield newQuiz.save();
            return { status: 201, message: savedQuiz };
        });
    }
    getQuizzesByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizzes = yield Quiz_1.default.find({ courseId }).populate('courseId', 'title description').exec();
            if (!quizzes || quizzes.length === 0) {
                return { status: 204, message: 'No quizzes found for this course.' };
            }
            return { status: 200, message: quizzes };
        });
    }
    getQuizById(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.default.findOne({ _id: quizId, courseId });
            if (!quiz) {
                return { status: 404, message: 'Quiz not found.' };
            }
            return { status: 200, message: quiz };
        });
    }
    updateQuiz(courseId, quizId, questions) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.default.findOne({ _id: quizId, courseId });
            if (!quiz) {
                return { status: 404, message: 'Quiz not found.' };
            }
            quiz.questions = questions;
            yield quiz.save();
            return { status: 200, message: { message: 'Quiz updated successfully.', quiz } };
        });
    }
    deleteQuiz(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.default.findOneAndDelete({ _id: quizId, courseId });
            if (!quiz) {
                return { status: 404, message: 'Quiz not found.' };
            }
            return { status: 200, message: { message: 'Quiz deleted successfully.' } };
        });
    }
}
exports.QuizRepository = QuizRepository;
