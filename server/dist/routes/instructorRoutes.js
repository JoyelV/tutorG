"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const instructorController_1 = require("../controllers/instructorController");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const courseController_1 = require("../controllers/courseController");
const categoryController_1 = require("../controllers/categoryController");
const quizController_1 = require("../controllers/quizController");
const userController_1 = require("../controllers/userController");
const VerifyToken_1 = require("../utils/VerifyToken");
const router = (0, express_1.Router)();
// AUTHENTICATION
router.post('/login', instructorController_1.login);
router.post('/send-otp', instructorController_1.sendOtp);
router.post('/resend-otp', instructorController_1.resendOtp);
router.post('/verify-otp', instructorController_1.verifyPasswordOtp);
router.post('/reset-password', instructorController_1.resetPassword);
//PROFILE MANAGEMENT
router.get('/profile', VerifyToken_1.verifyToken, instructorController_1.fetchUserProfile);
router.put('/update', VerifyToken_1.verifyToken, instructorController_1.editUserProfile);
router.put('/update-password', VerifyToken_1.verifyToken, instructorController_1.editPassword);
router.put('/upload-image', multerConfig_1.default.single('image'), VerifyToken_1.verifyToken, instructorController_1.uploadImage);
//CHAT MANANGEMENT
router.get('/messages', VerifyToken_1.verifyToken, userController_1.getMyMessages);
//COURSE MANAGEMENT
router.post("/addCourse", courseController_1.createCourse);
router.put("/course/:courseId", courseController_1.editCourse);
router.delete("/delete-course/:courseId", courseController_1.deleteCourse);
router.get('/courses', VerifyToken_1.verifyToken, courseController_1.getMyTutorCourses);
router.get('/course-view/:courseId', courseController_1.getViewCourses);
router.post('/addLesson', courseController_1.addLesson);
router.get('/view-lessons/:courseId', courseController_1.getViewChapters);
router.get('/view-lesson/:lessonId', courseController_1.getViewChapter);
router.put('/update-lesson/:lessonId', courseController_1.updateChapter);
router.delete('/delete-lesson', courseController_1.deleteLesson);
router.post('/quizzes/:courseId', quizController_1.addQuiz);
router.get('/quizzes/:courseId', quizController_1.getQuizzesByCourse);
router.get('/quizzes/:courseId/:quizId', quizController_1.getQuizById);
router.put('/quizzes/:courseId/:quizId', quizController_1.updateQuiz);
router.delete('/quizzes/:courseId/:quizId', quizController_1.deleteQuiz);
router.get('/categories', categoryController_1.getUnblockedCategories);
//STUDENT LIST
router.get('/students', VerifyToken_1.verifyToken, userController_1.getStudentsByInstructor);
router.get('/students-chat', VerifyToken_1.verifyToken, userController_1.getStudentsChat);
router.get('/coursesCount', VerifyToken_1.verifyToken, courseController_1.getEnrolledMyCourses);
router.get('/my-courses/coursesCount', VerifyToken_1.verifyToken, courseController_1.getMyCourses);
router.get('/studentsCount', VerifyToken_1.verifyToken, courseController_1.getMyStudents);
router.get('/earningsCount', VerifyToken_1.verifyToken, courseController_1.getMyEarnings);
router.get('/getEarningDetails', VerifyToken_1.verifyToken, courseController_1.getEarningDetails);
router.get('/getWithdrawalHistory', VerifyToken_1.verifyToken, courseController_1.getWithdrawalHistory);
router.post('/create-checkout-session', VerifyToken_1.verifyToken, instructorController_1.getStripePayment);
exports.default = router;
