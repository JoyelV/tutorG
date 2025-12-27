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
exports.getStatsCountsService = exports.getMyMessagesService = exports.getStudentsChatService = exports.getStudentsByInstructorService = exports.toggleUserStatusService = exports.uploadUserImage = exports.updatePassword = exports.updateUserProfile = exports.getUserProfileService = void 0;
const userRepository_1 = require("../repositories/userRepository");
const userRepository_2 = require("../repositories/userRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUserProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userRepository_1.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        else {
            throw new Error('An unexpected error occured');
        }
    }
});
exports.getUserProfileService = getUserProfileService;
const updateUserProfile = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    Object.assign(user, userData);
    return userRepository_1.userRepository.save(user);
});
exports.updateUserProfile = updateUserProfile;
const updatePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield userRepository_1.userRepository.updatePassword(userId, hashedPassword);
});
exports.updatePassword = updatePassword;
const uploadUserImage = (userId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_1.userRepository.updateUser(userId, { image: imageUrl });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.uploadUserImage = uploadUserImage;
const toggleUserStatusService = (userId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, userRepository_2.toggleUserStatusRepository)(userId, isBlocked);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error('Failed to update user status');
    }
});
exports.toggleUserStatusService = toggleUserStatusService;
const getStudentsByInstructorService = (instructorId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, userRepository_2.getStudentsByInstructorRepository)(instructorId, page, limit);
    return result;
});
exports.getStudentsByInstructorService = getStudentsByInstructorService;
const getStudentsChatService = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield (0, userRepository_2.getStudentsChatRepository)(instructorId);
    if (orders.length === 0) {
        throw new Error('No students found for this instructor.');
    }
    return orders;
});
exports.getStudentsChatService = getStudentsChatService;
const getMyMessagesService = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield (0, userRepository_2.getMyMessagesRepository)(senderId, receiverId);
    return messages;
});
exports.getMyMessagesService = getMyMessagesService;
const getStatsCountsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield (0, userRepository_2.getStatsCountsRepository)();
    return stats;
});
exports.getStatsCountsService = getStatsCountsService;
