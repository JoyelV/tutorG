"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const userController_1 = require("../controllers/userController");
const instructorController_1 = require("../controllers/instructorController");
const categoryController_1 = require("../controllers/categoryController");
const courseController_1 = require("../controllers/courseController");
const reviewController_1 = require("../controllers/reviewController");
const VerifyToken_1 = require("../utils/VerifyToken");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
const orderController = new orderController_1.OrderController();
// AUTHENTICATION
router.post('/login', adminController_1.login);
router.post('/send-otp', adminController_1.sendOtp);
router.post('/verify-otp', adminController_1.verifyPasswordOtp);
router.post('/reset-password', adminController_1.resetPassword);
//PROFILE MANAGEMENT
router.get('/profile', VerifyToken_1.verifyToken, adminController_1.fetchUserProfile);
router.put('/update', VerifyToken_1.verifyToken, adminController_1.editUserProfile);
router.put('/update-password', VerifyToken_1.verifyToken, adminController_1.editPassword);
router.put('/upload-image', multerConfig_1.default.single('image'), VerifyToken_1.verifyToken, adminController_1.uploadImage);
//Student,QA & Tutor Management
router.get('/users', VerifyToken_1.verifyToken, adminController_1.getAllUsers);
router.get('/instructors', VerifyToken_1.verifyToken, adminController_1.getAllInstructors);
router.patch('/users/:userId', VerifyToken_1.verifyToken, userController_1.toggleUserStatus);
router.patch('/instructors/:tutorId', VerifyToken_1.verifyToken, instructorController_1.toggleTutorStatus);
router.post('/add-tutor', multerConfig_1.default.single('image'), instructorController_1.addTutors);
//Category Management
router.get('/categories', VerifyToken_1.verifyToken, categoryController_1.getCategoriesPagination);
router.post('/categories', VerifyToken_1.verifyToken, categoryController_1.saveCategory);
router.put('/categories/:id', VerifyToken_1.verifyToken, categoryController_1.updateCategory);
router.patch('/categories/block/:id', VerifyToken_1.verifyToken, categoryController_1.deleteCategory);
//Course Management
router.patch('/course-status/:courseId', VerifyToken_1.verifyToken, courseController_1.courseStatus);
router.get('/courseData', VerifyToken_1.verifyToken, courseController_1.getCourseDatas);
router.get('/courseDetailview/:courseId', VerifyToken_1.verifyToken, courseController_1.getViewCourses);
router.put('/publish/:courseId', VerifyToken_1.verifyToken, courseController_1.publishCourse);
router.put('/reject/:courseId', VerifyToken_1.verifyToken, courseController_1.rejectCourse);
router.post('/courses/:courseId', VerifyToken_1.verifyToken, reviewController_1.addReview);
router.get('/reviews/:courseId', VerifyToken_1.verifyToken, reviewController_1.getReviews);
router.get('/instructorProfile/:instructorId', VerifyToken_1.verifyToken, courseController_1.getInstructorData);
//Order Management
router.get("/orders", VerifyToken_1.verifyToken, orderController.getOrders.bind(orderController));
router.get("/order-view/:orderId", VerifyToken_1.verifyToken, orderController.getOrderDetail.bind(orderController));
exports.default = router;
