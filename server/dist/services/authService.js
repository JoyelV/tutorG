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
exports.resetPasswordService = exports.googleLoginService = exports.loginService = exports.verifyOTP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpRepository_1 = require("../repositories/otpRepository");
const userRepository_1 = require("../repositories/userRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const User_1 = __importDefault(require("../models/User"));
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const storedEntry = otpRepository_1.otpRepository.getOtp(email);
    if (!storedEntry) {
        throw new Error('OTP expired or not sent');
    }
    const expirationTime = 1 * 60 * 1000;
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
    yield userRepository_1.userRepository.createUser(storedEntry.username, email, hashedPassword);
    otpRepository_1.otpRepository.deleteOtp(email);
    return 'User registered successfully';
});
exports.verifyOTP = verifyOTP;
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_1.userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new Error('User Blocked');
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets are not set');
    }
    yield userRepository_1.userRepository.updateUser(user._id.toString(), { onlineStatus: true });
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return {
        token,
        refreshToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
});
exports.loginService = loginService;
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLoginService = (googleToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
        throw new Error('Invalid Google token or payload');
    }
    const email = payload.email;
    let user = yield userRepository_1.userRepository.findUserByEmail(email);
    if (!user) {
        const generatedPassword = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        const hashedPassword = yield bcrypt_1.default.hash(generatedPassword, 10);
        user = yield User_1.default.create({
            email: payload.email,
            username: payload.name,
            password: hashedPassword,
            role: 'user',
        });
    }
    else {
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            throw new Error('User Blocked');
        }
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets are not set in environment variables');
    }
    yield userRepository_1.userRepository.updateUser(user._id.toString(), { onlineStatus: true });
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { token, refreshToken, user };
});
exports.googleLoginService = googleLoginService;
const resetPasswordService = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const user = yield userRepository_1.userRepository.findUserByEmail(decoded.email.toLowerCase());
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = yield userRepository_1.userRepository.updateUserPassword(decoded.email.toLowerCase(), hashedPassword);
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
