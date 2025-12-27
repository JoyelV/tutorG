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
exports.RateInstructorService = void 0;
const rateInstructorRepository_1 = require("../repositories/rateInstructorRepository");
class RateInstructorService {
    constructor() {
        this.rateInstructorRepository = new rateInstructorRepository_1.RateInstructorRepository();
    }
    addInstructorRatingService(userId, instructorId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (comment && comment.length < 4) {
                return { message: 'Comment must be at least 4 characters long.' };
            }
            const instructor = yield this.rateInstructorRepository.findInstructorById(instructorId);
            if (!instructor) {
                return { message: 'Instructor not found' };
            }
            const existingRating = yield this.rateInstructorRepository.findExistingRating(userId, instructorId);
            if (existingRating) {
                return { message: 'You have already rated this instructor' };
            }
            yield this.rateInstructorRepository.saveRating(userId, instructorId, rating, comment);
            const totalRatings = yield this.rateInstructorRepository.getTotalRatings(instructorId);
            const newAverageRating = totalRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings.length;
            yield this.rateInstructorRepository.updateInstructorRatings(instructorId, newAverageRating, totalRatings.length);
            return { message: 'Rating submitted successfully!' };
        });
    }
}
exports.RateInstructorService = RateInstructorService;
