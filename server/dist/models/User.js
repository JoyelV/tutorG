"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    phone: { type: String },
    image: { type: String },
    address: {
        line1: { type: String },
        line2: { type: String }
    },
    gender: { type: String },
    dob: { type: String },
    isBlocked: { type: Boolean, default: false },
    onlineStatus: { type: Boolean, default: false },
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
