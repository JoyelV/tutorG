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
exports.getInstructorFeedback = exports.getInstructorById = exports.addInstructorRating = exports.getStripePayment = exports.getTopTutors = exports.getMyTutors = exports.addTutors = exports.toggleTutorStatus = exports.uploadImage = exports.editPassword = exports.editUserProfile = exports.fetchUserProfile = exports.resetPassword = exports.verifyPasswordOtp = exports.sendOtp = exports.logout = exports.login = exports.resendOtp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const emailService_1 = require("../utils/emailService");
const otpGenerator_1 = require("../utils/otpGenerator");
const instructorService_1 = require("../services/instructorService");
const otpService_1 = require("../services/otpService");
const otpRepository_1 = require("../repositories/otpRepository");
const instructorService_2 = require("../services/instructorService");
const orderService_1 = require("../services/orderService");
const rateInstructorService_1 = require("../services/rateInstructorService");
const feedbackService_1 = require("../services/feedbackService");
dotenv_1.default.config();
/**
 * Resend OTP to the student email for registration.
 */
const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const emailLowerCase = email.toLowerCase();
    try {
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        otpRepository_1.otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
        yield (0, emailService_1.sendOTPEmail)(emailLowerCase, otp);
        res.status(200).json({ message: 'OTP resend to your email. Please verify.' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
    }
});
exports.resendOtp = resendOtp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const emailLowerCase = email.toLowerCase();
        const { token, refreshToken, user } = yield (0, instructorService_1.loginService)(emailLowerCase, password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(400).json({ message: 'An unknown error occurred' });
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (userId) {
            yield (0, instructorService_2.logoutService)(userId);
            res.status(200).json({ message: "Logout successfully" });
        }
    }
    catch (error) {
        res.status(400).json({ message: "An unknown error occurred" });
    }
});
exports.logout = logout;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const emailLowerCase = email.toLowerCase();
    const user = yield (0, instructorService_2.getUserByEmail)(emailLowerCase);
    if (!user) {
        res.status(404).json({ error: 'Email address not found in the system.' });
        return;
    }
    try {
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        yield otpService_1.otpService.generateAndSendOtp(emailLowerCase);
        res.status(200).send('OTP sent to email');
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
    }
});
exports.sendOtp = sendOtp;
const verifyPasswordOtp = (req, res, next) => {
    const { email, otp } = req.body;
    try {
        const emailLowerCase = email.toLowerCase();
        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }
        const token = otpService_1.otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        next(error);
    }
};
exports.verifyPasswordOtp = verifyPasswordOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        const message = yield (0, instructorService_1.resetPasswordService)(token, newPassword);
        res.status(200).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An unexpected error occurred');
        }
    }
});
exports.resetPassword = resetPassword;
const fetchUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const user = yield (0, instructorService_2.getUserProfileService)(userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.fetchUserProfile = fetchUserProfile;
const editUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const updates = req.body;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const updatedUser = yield (0, instructorService_2.updateUserProfile)(userId, updates);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.editUserProfile = editUserProfile;
const editPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        yield (0, instructorService_2.updatePassword)(userId, currentPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
});
exports.editPassword = editPassword;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
    }
    const imageUrl = req.file.path;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const updatedUser = yield (0, instructorService_2.uploadUserImage)(userId, imageUrl);
        res.status(200).json({ success: true, imageUrl, user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
});
exports.uploadImage = uploadImage;
const toggleTutorStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tutorId } = req.params;
        const { isBlocked } = req.body;
        if (tutorId) {
            const updatedUser = yield (0, instructorService_1.toggleTutorStatusService)(tutorId, isBlocked);
            res.status(200).json(updatedUser);
        }
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res.status(400).json({ message: error.message });
    }
});
exports.toggleTutorStatus = toggleTutorStatus;
const addTutors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tutor = yield (0, instructorService_2.addTutorService)(req.body, req.file);
        res.status(201).json({ message: 'Tutor added successfully!', tutor });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});
exports.addTutors = addTutors;
const orderService = new orderService_1.OrderService();
const getMyTutors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.userId;
        if (studentId) {
            const tutors = yield orderService.getMyTutorsService(studentId);
            res.status(200).json(tutors);
        }
    }
    catch (error) {
        console.error('Error fetching tutors:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getMyTutors = getMyTutors;
const getTopTutors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructors = yield (0, instructorService_2.getTopTutorsService)();
        res.status(200).json(instructors);
    }
    catch (error) {
        console.error('Error fetching top instructors:', error);
        res.status(500).json({ message: 'Failed to fetch instructors' });
    }
});
exports.getTopTutors = getTopTutors;
const stripe = require('stripe')(process.env.STRIPE_KEY);
const getStripePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const userId = req.userId;
    try {
        if (userId) {
            const instructor = yield (0, instructorService_2.getUserProfileService)(userId);
            if (!instructor) {
                res.status(404).send('Instructor not found');
                return;
            }
            const { username, email, image } = instructor;
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Withdrawal',
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/instructor/my-earnings?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}/instructor/my-earnings`,
                metadata: {
                    type: 'instructor_payout',
                    username,
                    email,
                    image,
                    amount
                },
            });
            res.json({ sessionId: session.id, instructorDetails: { username, email, image } });
        }
    }
    catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getStripePayment = getStripePayment;
const rateInstructorService = new rateInstructorService_1.RateInstructorService();
const addInstructorRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, comment } = req.body;
        const { instructorId } = req.params;
        const userId = req.userId;
        if (userId) {
            const response = yield rateInstructorService.addInstructorRatingService(userId, instructorId, rating, comment);
            res.status(201).json({ message: response.message });
        }
    }
    catch (error) {
        console.error('Error updating instructor rating:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});
exports.addInstructorRating = addInstructorRating;
const getInstructorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { instructorId } = req.params;
        const instructorData = yield (0, instructorService_2.getInstructorByIdService)(instructorId);
        res.status(200).json(instructorData);
    }
    catch (error) {
        console.error('Error fetching instructor data:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});
exports.getInstructorById = getInstructorById;
const feedbackService = new feedbackService_1.FeedbackService();
const getInstructorFeedback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { instructorId } = req.params;
        const feedback = yield feedbackService.getInstructorFeedback(instructorId);
        res.status(200).json(feedback);
    }
    catch (error) {
        console.error("Error fetching instructor feedback:", error);
        res.status(500).json({ message: error.message || "Server error. Could not fetch feedback." });
    }
});
exports.getInstructorFeedback = getInstructorFeedback;
