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
exports.getMyMessages = exports.getStudentsChat = exports.getStudentsByInstructor = exports.toggleUserStatus = exports.uploadImage = exports.editPassword = exports.editUserProfile = exports.fetchUserProfile = exports.resetPassword = exports.verifyPasswordOtp = exports.sendOtp = exports.refreshAccessToken = exports.googleSignIn = exports.login = exports.verifyRegisterOTP = exports.resendOtp = exports.register = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const emailService_1 = require("../utils/emailService");
const otpGenerator_1 = require("../utils/otpGenerator");
const authService_1 = require("../services/authService");
const otpService_1 = require("../services/otpService");
const otpRepository_1 = require("../repositories/otpRepository");
const Orders_1 = __importDefault(require("../models/Orders"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        otpRepository_1.otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
        yield (0, emailService_1.sendOTPEmail)(email, otp);
        res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
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
const verifyRegisterOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }
        const message = yield (0, authService_1.verifyOTP)(email, otp);
        res.status(201).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
            res.status(500).json({ message: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.verifyRegisterOTP = verifyRegisterOTP;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const { token, refreshToken, user } = yield (0, authService_1.loginService)(email, password);
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
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
    }
});
exports.login = login;
const googleSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token: googleToken } = req.body;
    if (!googleToken) {
        res.status(400).json({ message: 'Google token is required' });
        return;
    }
    try {
        const { token, refreshToken, user } = yield (0, authService_1.googleLoginService)(googleToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: 'Google Sign-In successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Google Sign-In error:', error.message || error);
        res.status(500).json({
            message: 'Google Sign-In failed. Please check credentials.',
        });
    }
});
exports.googleSignIn = googleSignIn;
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newToken = jsonwebtoken_1.default.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.status(200).json({ token: newToken });
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});
exports.refreshAccessToken = refreshAccessToken;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        yield otpService_1.otpService.generateAndSendOtp(email);
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
        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }
        const token = otpService_1.otpService.verifyOtpAndGenerateToken(email, otp);
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
        const message = yield (0, authService_1.resetPasswordService)(token, newPassword);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(400).json({ message: 'Registered Email is required' });
        return;
    }
});
exports.resetPassword = resetPassword;
const fetchUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const user = yield (0, userService_1.getUserProfileService)(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
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
        const updatedUser = yield (0, userService_1.updateUserProfile)(userId, updates);
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
        yield (0, userService_1.updatePassword)(userId, currentPassword, newPassword);
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
        const updatedUser = yield (0, userService_1.uploadUserImage)(userId, imageUrl);
        res.status(200).json({ success: true, imageUrl, user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
});
exports.uploadImage = uploadImage;
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;
        if (!userId) {
            res.status(400).json({ message: 'Missing userId in request parameters' });
            return;
        }
        if (typeof isBlocked !== 'boolean') {
            res.status(400).json({ message: 'Invalid or missing isBlocked value' });
            return;
        }
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { isBlocked }, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Failed to update user status', error: error });
    }
});
exports.toggleUserStatus = toggleUserStatus;
const getStudentsByInstructor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const { page = 1, limit = 4 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const totalStudents = yield Orders_1.default.countDocuments({
            tutorId: instructorId,
            studentId: { $ne: null },
        });
        const students = yield Orders_1.default
            .find({
            tutorId: instructorId,
            studentId: { $ne: null },
        })
            .populate("studentId", "username email phone image gender")
            .populate("courseId", "title level")
            .skip(skip)
            .limit(Number(limit));
        res.status(200).json({
            students,
            totalStudents,
            currentPage: Number(page),
            totalPages: Math.ceil(totalStudents / Number(limit)),
        });
    }
    catch (error) {
        console.error('Error fetching students by instructor:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});
exports.getStudentsByInstructor = getStudentsByInstructor;
const getStudentsChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const orders = yield Orders_1.default
            .find({
            tutorId: instructorId,
            studentId: { $ne: null },
        })
            .populate("studentId", "username email phone image gender")
            .populate("courseId", "title level");
        if (orders.length === 0) {
            res.status(404).json({ message: "No students found for this instructor." });
            return;
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error fetching students by instructor:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});
exports.getStudentsChat = getStudentsChat;
const getMyMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.query;
    try {
        const messages = yield Message_1.default.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});
exports.getMyMessages = getMyMessages;
