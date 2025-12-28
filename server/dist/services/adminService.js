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
exports.uploadUserImage = exports.updatePassword = exports.updateUserProfile = exports.getUserProfileService = exports.resetPasswordService = exports.loginService = exports.verifyOTP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpRepository_1 = require("../repositories/otpRepository");
const adminRepository_1 = require("../repositories/adminRepository");
/* =========================
   OTP VERIFICATION
========================= */
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const storedEntry = otpRepository_1.otpRepository.getOtp(email);
    if (!storedEntry) {
        throw new Error("OTP expired or not sent");
    }
    const expirationTime = 2 * 60 * 1000;
    const currentTime = Date.now();
    const otpCreatedTime = new Date(storedEntry.createdAt).getTime();
    if (currentTime - otpCreatedTime > expirationTime) {
        otpRepository_1.otpRepository.deleteOtp(email);
        throw new Error("OTP has expired");
    }
    if (storedEntry.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    const hashedPassword = yield bcrypt_1.default.hash(storedEntry.password, 10);
    yield adminRepository_1.adminRepository.createUser(storedEntry.username, email, hashedPassword);
    otpRepository_1.otpRepository.deleteOtp(email);
    return "User registered successfully";
});
exports.verifyOTP = verifyOTP;
/* =========================
   LOGIN SERVICE
========================= */
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminRepository_1.adminRepository.findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT secrets are not set");
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return {
        token,
        refreshToken,
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
});
exports.loginService = loginService;
/* =========================
   RESET PASSWORD
========================= */
const resetPasswordService = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        if (!userId) {
            throw new Error("Invalid token");
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const updatedUser = yield adminRepository_1.adminRepository.updatePassword(userId, hashedPassword);
        if (!updatedUser) {
            throw new Error("Failed to update password");
        }
        return "Password reset successful";
    }
    catch (_a) {
        throw new Error("Invalid or expired token");
    }
});
exports.resetPasswordService = resetPasswordService;
/* =========================
   PROFILE SERVICES
========================= */
const getUserProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminRepository_1.adminRepository.findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
exports.getUserProfileService = getUserProfileService;
const updateUserProfile = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield adminRepository_1.adminRepository.updateUser(userId, userData);
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
});
exports.updateUserProfile = updateUserProfile;
/* =========================
   CHANGE PASSWORD
========================= */
const updatePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminRepository_1.adminRepository.findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield adminRepository_1.adminRepository.updatePassword(userId, hashedPassword);
});
exports.updatePassword = updatePassword;
/* =========================
   UPDATE PROFILE IMAGE
========================= */
const uploadUserImage = (userId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminRepository_1.adminRepository.updateUser(userId, {
        image: imageUrl,
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
exports.uploadUserImage = uploadUserImage;
