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
exports.RateInstructorRepository = void 0;
const RateInstructor_1 = __importDefault(require("../models/RateInstructor"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
class RateInstructorRepository {
    findInstructorById(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instructor_1.default.findById(instructorId);
        });
    }
    findExistingRating(userId, instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RateInstructor_1.default.findOne({ userId, instructorId });
        });
    }
    saveRating(userId, instructorId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRating = new RateInstructor_1.default({
                userId,
                instructorId,
                rating,
                comment,
            });
            return yield newRating.save();
        });
    }
    getTotalRatings(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RateInstructor_1.default.find({ instructorId }).exec();
        });
    }
    updateInstructorRatings(instructorId, averageRating, numberOfRatings) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instructor_1.default.findByIdAndUpdate(instructorId, { averageRating, numberOfRatings }, { new: true });
        });
    }
}
exports.RateInstructorRepository = RateInstructorRepository;
