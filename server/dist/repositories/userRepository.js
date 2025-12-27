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
exports.getStatsCountsRepository = exports.getMyMessagesRepository = exports.getStudentsChatRepository = exports.getStudentsByInstructorRepository = exports.toggleUserStatusRepository = exports.userRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
const Orders_1 = __importDefault(require("../models/Orders"));
const Message_1 = __importDefault(require("../models/Message"));
exports.userRepository = {
    createUser(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new User_1.default({ username, email, password });
            yield newUser.save();
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findOne({ email });
        });
    },
    updateUserPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email });
            if (!user)
                return null;
            user.password = newPassword;
            return yield user.save();
        });
    },
    findUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield User_1.default.findById(userId);
    }),
    updateUser(userId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findByIdAndUpdate(userId, updates, { new: true });
        });
    },
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return user.save();
        });
    },
    updatePassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        });
    },
    updateUserOtp(email, otp, otpExpiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.updateOne({ email }, { otp, otpExpiry });
        });
    },
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_1.default.find({}, 'image username email phone gender role isBlocked');
            }
            catch (error) {
                throw new Error('Error fetching users');
            }
        });
    },
    logoutRepository(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User_1.default.findByIdAndUpdate(userId, { onlineStatus: false }, { new: true });
            }
            catch (error) {
                throw new Error('Database error');
            }
        });
    },
};
const toggleUserStatusRepository = (userId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    return User_1.default.findByIdAndUpdate(userId, { isBlocked }, { new: true });
});
exports.toggleUserStatusRepository = toggleUserStatusRepository;
const getStudentsByInstructorRepository = (instructorId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (Number(page) - 1) * Number(limit);
    const totalStudents = yield Orders_1.default.countDocuments({
        tutorId: instructorId,
        studentId: { $ne: null },
    });
    const students = yield Orders_1.default.find({
        tutorId: instructorId,
        studentId: { $ne: null },
    })
        .populate('studentId', 'username email phone image gender')
        .populate('courseId', 'title level')
        .skip(skip)
        .limit(Number(limit));
    return {
        students,
        totalStudents,
        currentPage: Number(page),
        totalPages: Math.ceil(totalStudents / Number(limit)),
    };
});
exports.getStudentsByInstructorRepository = getStudentsByInstructorRepository;
const getStudentsChatRepository = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    return Orders_1.default.find({
        tutorId: instructorId,
        studentId: { $ne: null },
    })
        .populate('studentId', 'username email phone image gender onlineStatus')
        .populate('courseId', 'title level');
});
exports.getStudentsChatRepository = getStudentsChatRepository;
const getMyMessagesRepository = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    return Message_1.default.find({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
        ],
    }).sort({ createdAt: 1 });
});
exports.getMyMessagesRepository = getMyMessagesRepository;
const getStatsCountsRepository = () => __awaiter(void 0, void 0, void 0, function* () {
    const [studentCount, courseCount, tutorCount] = yield Promise.all([
        User_1.default.countDocuments(),
        Course_1.default.countDocuments(),
        Instructor_1.default.countDocuments(),
    ]);
    return {
        students: studentCount,
        courses: courseCount,
        tutors: tutorCount,
    };
});
exports.getStatsCountsRepository = getStatsCountsRepository;
