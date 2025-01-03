"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    phone: { type: String },
    image: { type: String, default: null },
    address: {
        line1: { type: String },
        line2: { type: String },
    },
    gender: { type: String },
    dob: { type: Date },
});
exports.default = (0, mongoose_1.model)('Admin', adminSchema);
