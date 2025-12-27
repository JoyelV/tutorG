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
exports.FeedbackService = void 0;
const feedbackRepository_1 = require("../repositories/feedbackRepository");
class FeedbackService {
    constructor() {
        this.feedbackRepository = new feedbackRepository_1.FeedbackRepository();
    }
    getInstructorFeedback(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!instructorId) {
                throw new Error("Instructor ID is required.");
            }
            return yield this.feedbackRepository.getInstructorFeedback(instructorId);
        });
    }
}
exports.FeedbackService = FeedbackService;
