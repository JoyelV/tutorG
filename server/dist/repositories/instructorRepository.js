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
exports.instructorRepository = void 0;
const Instructor_1 = __importDefault(require("../models/Instructor"));
const Course_1 = __importDefault(require("../models/Course"));
exports.instructorRepository = {
    createUser(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new Instructor_1.default({ username, email, password });
            yield newUser.save();
            console.log("newUser in userrepo - vERIFTY OTP", newUser);
        });
    },
    findCoursesByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course_1.default.find({ instructorId });
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instructor_1.default.findOne({ email });
        });
    },
    updateUserPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Instructor_1.default.findOne({ email });
            if (!user)
                return null;
            user.password = newPassword;
            return yield user.save();
        });
    },
    findUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Instructor_1.default.findById(userId);
    }),
    updateUser(userId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return Instructor_1.default.findByIdAndUpdate(userId, updates, { new: true });
        });
    },
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return user.save();
        });
    },
    updatePassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return Instructor_1.default.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        });
    },
    updateUserOtp(email, otp, otpExpiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instructor_1.default.updateOne({ email }, { otp, otpExpiry });
        });
    },
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Instructor_1.default.find({});
            }
            catch (error) {
                throw new Error('Error fetching instructors');
            }
        });
    },
    changeTutorStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield Instructor_1.default.findOne({ _id: id });
                if (!instructor) {
                    throw new Error('Student not found');
                }
                instructor.isBlocked = !instructor.isBlocked;
                yield instructor.save();
                return instructor;
            }
            catch (error) {
                throw error;
            }
        });
    },
    updateOnlineStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Instructor_1.default.findByIdAndUpdate(userId, { onlineStatus: status }, { new: true });
        });
    },
    updateTutorStatus(tutorId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instructor_1.default.findByIdAndUpdate(tutorId, { isBlocked }, { new: true });
        });
    },
    createTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTutor = new Instructor_1.default(tutorData);
            return yield newTutor.save();
        });
    },
    getTopTutors(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instructor_1.default.find()
                .sort({ averageRating: -1 })
                .limit(limit)
                .select('username headline areasOfExpertise image averageRating numberOfRatings')
                .exec();
        });
    },
};
