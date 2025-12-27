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
exports.uploadImage = exports.editPassword = exports.editUserProfile = exports.fetchUserProfile = exports.getAllInstructors = exports.getAllUsers = exports.resetPassword = exports.verifyPasswordOtp = exports.sendOtp = exports.login = exports.resendOtp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const emailService_1 = require("../utils/emailService");
const otpGenerator_1 = require("../utils/otpGenerator");
const adminService_1 = require("../services/adminService");
const otpService_1 = require("../services/otpService");
const otpRepository_1 = require("../repositories/otpRepository");
const adminService_2 = require("../services/adminService");
const userRepository_1 = require("../repositories/userRepository");
const instructorRepository_1 = require("../repositories/instructorRepository");
const adminRepository_1 = require("../repositories/adminRepository");
dotenv_1.default.config();
/**
 * Resend OTP to the student email for registration.
 */
const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        otpRepository_1.otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
        yield (0, emailService_1.sendOTPEmail)(email, otp);
        res.status(200).json({ message: 'OTP resend to your email. Please verify.' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
    }
});
exports.resendOtp = resendOtp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const emailLowerCase = email.toLowerCase();
        const { token, refreshToken, user } = yield (0, adminService_1.loginService)(emailLowerCase, password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict', // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(400).json({ message: 'An unknown error occurred' });
    }
});
exports.login = login;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const emailLowerCase = email.toLowerCase();
        const user = yield adminRepository_1.adminRepository.findUserByEmail(emailLowerCase);
        if (!user) {
            res.status(400).json({ message: 'Email is not in database' });
            return;
        }
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        yield otpService_1.otpService.generateAndSendOtp(emailLowerCase);
        res.status(200).send('OTP sent to email');
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
    }
});
exports.sendOtp = sendOtp;
const verifyPasswordOtp = (req, res, next) => {
    const { email, otp } = req.body;
    try {
        const emailLowerCase = email.toLowerCase();
        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }
        const token = otpService_1.otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        next(error);
    }
};
exports.verifyPasswordOtp = verifyPasswordOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        const message = yield (0, adminService_1.resetPasswordService)(token, newPassword);
        res.status(200).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An unexpected error occurred');
        }
    }
});
exports.resetPassword = resetPassword;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userRepository_1.userRepository.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
const getAllInstructors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructors = yield instructorRepository_1.instructorRepository.getAllInstructors();
        res.status(200).json(instructors);
    }
    catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ message: 'Failed to fetch instructors' });
    }
});
exports.getAllInstructors = getAllInstructors;
const fetchUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const user = yield (0, adminService_2.getUserProfileService)(userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.fetchUserProfile = fetchUserProfile;
const editUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const updates = req.body;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const updatedUser = yield (0, adminService_2.updateUserProfile)(userId, updates);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.editUserProfile = editUserProfile;
const editPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        yield (0, adminService_2.updatePassword)(userId, currentPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
});
exports.editPassword = editPassword;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
    }
    const imageUrl = req.file.path;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const updatedUser = yield (0, adminService_2.uploadUserImage)(userId, imageUrl);
        res.status(200).json({ success: true, imageUrl, user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
});
exports.uploadImage = uploadImage;
