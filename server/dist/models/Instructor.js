"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const instructorSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'instructor' },
    phone: { type: String },
    image: { type: String },
    address: {
        line1: { type: String },
        line2: { type: String },
    },
    gender: { type: String },
    dob: { type: String },
    bio: { type: String },
    about: { type: String },
    headline: { type: String },
    areasOfExpertise: { type: String },
    highestQualification: { type: String },
    isBlocked: { type: Boolean, default: false },
    earnings: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    onlineStatus: { type: Boolean, default: false },
    transactions: [
        {
            date: { type: Date, required: true },
            method: { type: String, required: true },
            status: { type: String, required: true },
            amount: { type: Number, required: true },
        },
    ],
    averageRating: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 },
    website: { type: String, required: true },
    facebook: { type: String, required: true },
    twitter: { type: String, required: true },
    linkedin: { type: String, required: true },
    instagram: { type: String, required: true },
    github: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Instructor', instructorSchema);
