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
exports.userRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
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
                return yield User_1.default.find({}, 'username email phone gender role isBlocked');
            }
            catch (error) {
                throw new Error('Error fetching users');
            }
        });
    },
};