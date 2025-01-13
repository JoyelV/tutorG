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
exports.submitQuiz = exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getQuizzesByCourse = exports.addQuiz = void 0;
const Quiz_1 = __importDefault(require("../models/Quiz"));
const UserQuizResponse_1 = __importDefault(require("../models/UserQuizResponse"));
const addQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questions } = req.body;
        const { courseId } = req.params;
        if (!Array.isArray(questions) || questions.length === 0) {
            res.status(400).json({ message: 'Quiz must contain at least one question.' });
            return;
        }
        for (const question of questions) {
            const { question: text, options, answer } = question;
            if (!text || !Array.isArray(options) || options.length !== 4 || !answer) {
                res.status(400).json({ message: 'Each question must have a text, 4 options, and an answer.' });
                return;
            }
            if (!options.includes(answer)) {
                res.status(400).json({ message: 'The answer must match one of the options.' });
                return;
            }
        }
        const newQuiz = new Quiz_1.default({
            questions,
            courseId,
        });
        const savedQuiz = yield newQuiz.save();
        res.status(201).json(savedQuiz);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addQuiz = addQuiz;
const getQuizzesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    if (!courseId) {
        res.status(400).json({ message: 'Course ID is required.' });
        return;
    }
    try {
        const quizzes = yield Quiz_1.default.find({ courseId })
            .populate('courseId', 'title description')
            .exec();
        if (!quizzes || quizzes.length === 0) {
            res.status(204).json({ message: 'No quizzes found for this course.' });
            return;
        }
        res.status(200).json(quizzes);
    }
    catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Failed to fetch quizzes.', error: error.message });
    }
});
exports.getQuizzesByCourse = getQuizzesByCourse;
const getQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, quizId } = req.params;
    try {
        const quiz = yield Quiz_1.default.findOne({ _id: quizId, courseId });
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found.' });
            return;
        }
        res.status(200).json(quiz);
    }
    catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Failed to fetch quiz.' });
    }
});
exports.getQuizById = getQuizById;
const updateQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, quizId } = req.params;
    const { question, answer, options } = req.body;
    try {
        const quiz = yield Quiz_1.default.findOneAndUpdate({ _id: quizId, courseId }, { question, answer, options }, { new: true, runValidators: true });
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found.' });
            return;
        }
        res.status(200).json({ message: 'Quiz updated successfully.', quiz });
    }
    catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Failed to update quiz.' });
    }
});
exports.updateQuiz = updateQuiz;
const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, quizId } = req.params;
    try {
        const quiz = yield Quiz_1.default.findOneAndDelete({ _id: quizId, courseId });
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found.' });
            return;
        }
        res.status(200).json({ message: 'Quiz deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Failed to delete quiz.' });
    }
});
exports.deleteQuiz = deleteQuiz;
const submitQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, answers } = req.body;
    const userId = req.userId;
    try {
        const quiz = yield Quiz_1.default.findById(quizId).populate('questions');
        if (!quiz) {
            res.status(404).send('Quiz not found');
            return;
        }
        const existingResponse = yield UserQuizResponse_1.default.findOne({ quizId, userId });
        if (existingResponse && existingResponse.attempts >= 5) {
            res.status(400).send({ message: 'Maximum attempts exceeded for this quiz' });
            return;
        }
        let score = 0;
        const totalQuestions = quiz.questions.length;
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
        res.status(200).send({
            score,
            totalQuestions,
            correctAnswers: correctAnswers.length,
            message: 'Quiz submitted successfully',
        });
    }
    catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).send({ message: 'An error occurred while submitting the quiz' });
    }
});
exports.submitQuiz = submitQuiz;
