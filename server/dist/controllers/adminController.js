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
const otpRepository_1 = require("../repositories/otpRepository");
const otpService_1 = require("../services/otpService");
const adminService_1 = require("../services/adminService");
const userRepository_1 = require("../repositories/userRepository");
const instructorRepository_1 = require("../repositories/instructorRepository");
const adminRepository_1 = require("../repositories/adminRepository");
dotenv_1.default.config();
/* =========================
   RESEND OTP (REGISTER)
========================= */
const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        otpRepository_1.otpRepository.saveOtp(email, {
            otp,
            username,
            password,
            createdAt: new Date(),
        });
        yield (0, emailService_1.sendOTPEmail)(email, otp);
        res
            .status(200)
            .json({ message: "OTP resent to your email. Please verify." });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        next(error);
    }
});
exports.resendOtp = resendOtp;
/* =========================
   LOGIN
========================= */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const emailLowerCase = email.toLowerCase();
        const { token, refreshToken, user } = yield (0, adminService_1.loginService)(emailLowerCase, password);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id, // ✅ FIXED (DTO)
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid email or password" });
    }
});
exports.login = login;
/* =========================
   SEND OTP (RESET PASSWORD)
========================= */
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        const emailLowerCase = email.toLowerCase();
        const user = yield adminRepository_1.adminRepository.findUserByEmail(emailLowerCase);
        if (!user) {
            res.status(400).json({ message: "Email not found" });
            return;
        }
        yield otpService_1.otpService.generateAndSendOtp(emailLowerCase);
        res.status(200).json({ message: "OTP sent to email" });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        next(error);
    }
});
exports.sendOtp = sendOtp;
/* =========================
   VERIFY OTP (RESET PASSWORD)
========================= */
const verifyPasswordOtp = (req, res, next) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            res.status(400).json({ message: "Email and OTP are required" });
            return;
        }
        const emailLowerCase = email.toLowerCase();
        const token = otpService_1.otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        next(error);
    }
};
exports.verifyPasswordOtp = verifyPasswordOtp;
/* =========================
   RESET PASSWORD
========================= */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        const message = yield (0, adminService_1.resetPasswordService)(token, newPassword);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
});
exports.resetPassword = resetPassword;
/* =========================
   GET ALL USERS
========================= */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userRepository_1.userRepository.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
/* =========================
   GET ALL INSTRUCTORS
========================= */
const getAllInstructors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructors = yield instructorRepository_1.instructorRepository.getAllInstructors();
        res.status(200).json(instructors);
    }
    catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ message: "Failed to fetch instructors" });
    }
});
exports.getAllInstructors = getAllInstructors;
/* =========================
   FETCH PROFILE
========================= */
const fetchUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID missing" });
        return;
    }
    try {
        const user = yield (0, adminService_1.getUserProfileService)(userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: "User not found" });
    }
});
exports.fetchUserProfile = fetchUserProfile;
/* =========================
   UPDATE PROFILE
========================= */
const editUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const updates = req.body;
    if (!userId) {
        res.status(400).json({ message: "User ID missing" });
        return;
    }
    try {
        const updatedUser = yield (0, adminService_1.updateUserProfile)(userId, updates);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update profile" });
    }
});
exports.editUserProfile = editUserProfile;
/* =========================
   UPDATE PASSWORD
========================= */
const editPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        res.status(400).json({ message: "User ID missing" });
        return;
    }
    try {
        yield (0, adminService_1.updatePassword)(userId, currentPassword, newPassword);
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        res.status(400).json({ message: "Password update failed" });
    }
});
exports.editPassword = editPassword;
/* =========================
   UPLOAD PROFILE IMAGE
========================= */
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }
    if (!userId) {
        res.status(400).json({ message: "User ID missing" });
        return;
    }
    try {
        const imageUrl = req.file.path;
        const updatedUser = yield (0, adminService_1.uploadUserImage)(userId, imageUrl);
        res.status(200).json({
            success: true,
            imageUrl,
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Image upload failed" });
    }
});
exports.uploadImage = uploadImage;
