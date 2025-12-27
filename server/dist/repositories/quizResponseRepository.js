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
exports.UserQuizResponseRepository = void 0;
const UserQuizResponse_1 = __importDefault(require("../models/UserQuizResponse"));
const Quiz_1 = __importDefault(require("../models/Quiz"));
class UserQuizResponseRepository {
    submitQuiz(quizId, userId, answers) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.default.findById(quizId).populate('questions');
            if (!quiz) {
                return { status: 404, message: 'Quiz not found' };
            }
            const existingResponse = yield UserQuizResponse_1.default.findOne({ quizId, userId });
            if (existingResponse && existingResponse.attempts >= 5) {
                return { status: 400, message: 'Maximum attempts exceeded for this quiz' };
            }
            let score = 0;
            const correctAnswers = [];
            answers.forEach((answer) => {
                const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
                if (question && question.answer === answer.answer) {
                    score += 1;
                    correctAnswers.push(answer.questionId);
                }
            });
            if (existingResponse) {
                existingResponse.answers = answers;
                existingResponse.score = score;
                existingResponse.attempts += 1;
                yield existingResponse.save();
            }
            else {
                const userQuizResponse = new UserQuizResponse_1.default({
                    quizId,
                    userId,
                    answers,
                    score,
                    attempts: 1,
                });
                yield userQuizResponse.save();
            }
            return {
                status: 200,
                message: {
                    score,
                    totalQuestions: quiz.questions.length,
                    correctAnswers: correctAnswers.length,
                    message: 'Quiz submitted successfully',
                },
            };
        });
    }
}
exports.UserQuizResponseRepository = UserQuizResponseRepository;
