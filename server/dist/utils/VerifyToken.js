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
exports.verifyToken = exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
const JWT_SECRET = process.env.JWT_SECRET;
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
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
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});
exports.refreshAccessToken = refreshAccessToken;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded, "decoded");
        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
            res.status(403).json({ message: 'Invalid token payload' });
            return;
        }
        req.userId = decoded.id;
        if (decoded.role === 'user') {
            const user = yield User_1.default.findById(decoded.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (user.isBlocked) {
                res.status(403).json({ message: 'User is blocked' });
                return;
            }
        }
        else if (decoded.role === 'instructor') {
            const instructor = yield Instructor_1.default.findById(decoded.id);
            if (!instructor) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (instructor.isBlocked) {
                res.status(403).json({ message: 'User is blocked' });
                return;
            }
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
});
exports.verifyToken = verifyToken;
