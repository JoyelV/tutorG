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
exports.getUserByEmail = exports.getInstructorByIdService = exports.getTopTutorsService = exports.addTutorService = exports.toggleTutorStatusService = exports.logoutService = exports.uploadUserImage = exports.updatePassword = exports.updateUserProfile = exports.getUserProfileService = exports.resetPasswordService = exports.loginService = exports.verifyOTP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpRepository_1 = require("../repositories/otpRepository");
const instructorRepository_1 = require("../repositories/instructorRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const storedEntry = otpRepository_1.otpRepository.getOtp(email);
    if (!storedEntry) {
        throw new Error('OTP expired or not sent');
    }
    const expirationTime = 1 * 60 * 1000; // 1 minute
    const currentTime = new Date().getTime();
    const otpCreatedTime = new Date(storedEntry.createdAt).getTime();
    if (currentTime - otpCreatedTime > expirationTime) {
        otpRepository_1.otpRepository.deleteOtp(email);
        throw new Error('OTP has expired');
    }
    if (storedEntry.otp !== otp) {
        throw new Error('Invalid OTP');
    }
    const hashedPassword = yield bcrypt_1.default.hash(storedEntry.password, 10);
    yield instructorRepository_1.instructorRepository.createUser(storedEntry.username, email, hashedPassword);
    otpRepository_1.otpRepository.deleteOtp(email);
    return 'User registered successfully';
});
exports.verifyOTP = verifyOTP;
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield instructorRepository_1.instructorRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isBlocked) {
        throw new Error('User Blocked');
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets are not set');
    }
    yield instructorRepository_1.instructorRepository.updateUser(user._id.toString(), { onlineStatus: true });
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return {
        token,
        refreshToken,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
});
exports.loginService = loginService;
const resetPasswordService = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT secret is not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const user = yield instructorRepository_1.instructorRepository.findUserByEmail(decoded.email.toLowerCase());
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = yield instructorRepository_1.instructorRepository.updateUserPassword(decoded.email.toLowerCase(), hashedPassword);
        if (!updatedUser) {
            throw new Error('Failed to update password');
        }
        return 'Password reset successful';
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
});
exports.resetPasswordService = resetPasswordService;
// Profile Service management
const getUserProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield instructorRepository_1.instructorRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.getUserProfileService = getUserProfileService;
const updateUserProfile = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield instructorRepository_1.instructorRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Use the repository's updateUser method instead of .save()
    const updatedUser = yield instructorRepository_1.instructorRepository.updateUser(userId, userData);
    return updatedUser;
});
exports.updateUserProfile = updateUserProfile;
const updatePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield instructorRepository_1.instructorRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield instructorRepository_1.instructorRepository.updatePassword(userId, hashedPassword);
});
exports.updatePassword = updatePassword;
const uploadUserImage = (userId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield instructorRepository_1.instructorRepository.updateUser(userId, { image: imageUrl });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.uploadUserImage = uploadUserImage;
const logoutService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield instructorRepository_1.instructorRepository.updateOnlineStatus(userId, false);
});
exports.logoutService = logoutService;
const toggleTutorStatusService = (tutorId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tutorId) {
        throw new Error('Missing tutorId in request parameters');
    }
    if (typeof isBlocked !== 'boolean') {
        throw new Error('Invalid or missing isBlocked value');
    }
    const updatedUser = yield instructorRepository_1.instructorRepository.updateTutorStatus(tutorId, isBlocked);
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
});
exports.toggleTutorStatusService = toggleTutorStatusService;
const addTutorService = (tutorData, file) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phone, password, headline, areasOfExpertise, bio, highestQualification, website, facebook, linkedin, twitter, instagram, github, isBlocked, tutorRequest, } = tutorData;
    if (!file) {
        throw new Error('No file uploaded');
    }
    if (!username || !email || !phone || !password) {
        throw new Error('Required fields are missing');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const tutor = yield instructorRepository_1.instructorRepository.createTutor({
        username,
        email,
        phone,
        password: hashedPassword,
        headline,
        image: file.path,
        areasOfExpertise,
        bio,
        highestQualification,
        website,
        facebook,
        linkedin,
        twitter,
        instagram,
        github,
        isBlocked,
        tutorRequest,
    });
    return tutor;
});
exports.addTutorService = addTutorService;
const getTopTutorsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield instructorRepository_1.instructorRepository.getTopTutors(5);
});
exports.getTopTutorsService = getTopTutorsService;
const getInstructorByIdService = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const instructor = yield instructorRepository_1.instructorRepository.findUserById(instructorId);
    if (!instructor) {
        throw new Error('Instructor not found');
    }
    const courses = yield instructorRepository_1.instructorRepository.findCoursesByInstructor(instructorId);
    const totalCourses = courses.length;
    // Collect unique student IDs
    const uniqueStudentIds = new Set();
    courses.forEach((course) => {
        course.students.forEach((studentId) => {
            uniqueStudentIds.add(studentId.toString());
        });
    });
    const totalStudents = uniqueStudentIds.size;
    return {
        username: instructor.username,
        email: instructor.email,
        image: instructor.image,
        bio: instructor.bio,
        about: instructor.about,
        headline: instructor.headline,
        areasOfExpertise: instructor.areasOfExpertise,
        highestQualification: instructor.highestQualification,
        averageRating: instructor.averageRating,
        numberOfRatings: instructor.numberOfRatings,
        website: instructor.website,
        facebook: instructor.facebook,
        twitter: instructor.twitter,
        linkedin: instructor.linkedin,
        instagram: instructor.instagram,
        github: instructor.github,
        totalStudents,
        totalCourses,
    };
});
exports.getInstructorByIdService = getInstructorByIdService;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new Error('Email is required');
    }
    const user = yield instructorRepository_1.instructorRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.getUserByEmail = getUserByEmail;
