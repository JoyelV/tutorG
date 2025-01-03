"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRepository = void 0;
const otpStorage = {};
exports.otpRepository = {
    saveOtp(email, entry) {
        if (otpStorage[email]) {
            delete otpStorage[email];
        }
        otpStorage[email] = Object.assign({}, entry);
    },
    getOtp(email) {
        return otpStorage[email] || null;
    },
    deleteOtp(email) {
        delete otpStorage[email];
    }
};
