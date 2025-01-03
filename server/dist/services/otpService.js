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
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = void 0;
const forgotOtpRepository_1 = require("../repositories/forgotOtpRepository");
const emailService_1 = require("../utils/emailService");
const jwtHelper_1 = require("../utils/jwtHelper");
exports.otpService = {
    generateAndSendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = Math.floor(100000 + Math.random() * 900000);
            forgotOtpRepository_1.otpRepository.saveOtp(email, otp);
            yield (0, emailService_1.sendOTPEmail)(email, otp.toString());
        });
    },
    verifyOtpAndGenerateToken(email, otp) {
        const storedOtp = forgotOtpRepository_1.otpRepository.getOtp(email);
        console.log("resend storedOtp email", storedOtp);
        if (!storedOtp || storedOtp !== parseInt(otp, 10)) {
            throw new Error('Invalid OTP');
        }
        forgotOtpRepository_1.otpRepository.deleteOtp(email);
        const token = (0, jwtHelper_1.generateToken)({ email }, '15m');
        return token;
    },
};
