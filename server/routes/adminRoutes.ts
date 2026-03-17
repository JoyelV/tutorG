import { Router } from 'express';
import {
  login,
  sendOtp,
  resetPassword,
  verifyPasswordOtp,
  fetchUserProfile,
  editUserProfile,
  editPassword,
  uploadImage,
  getAllUsers,
  getAllInstructors,
  getAnalytics,
  getRevenueAnalytics,
  getCategoryDistribution,
  getTopCourses,
}
  from '../controllers/adminController';
import upload from '../config/multerConfig';
import { toggleUserStatus } from '../controllers/userController';
import { addTutors, toggleTutorStatus } from '../controllers/instructorController';
import { deleteCategory, getCategoriesPagination, saveCategory, updateCategory } from '../controllers/categoryController';
import { courseStatus, getCourseDatas, getInstructorData, getViewCourses, publishCourse, rejectCourse } from '../controllers/courseController';
import { addReview, getReviews } from '../controllers/reviewController';
import { verifyToken } from '../utils/VerifyToken';
import { OrderController } from "../controllers/orderController";

const router = Router();
const orderController = new OrderController();

// AUTHENTICATION
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//PROFILE MANAGEMENT
router.get('/profile', verifyToken, fetchUserProfile);
router.put('/profile', verifyToken, editUserProfile);
router.put('/profile/password', verifyToken, editPassword);
router.put('/profile/image', upload.single('image'), verifyToken, uploadImage);

//Student,QA & Tutor Management
router.get('/users', verifyToken, getAllUsers);
router.get('/instructors', verifyToken, getAllInstructors);
router.patch('/users/:userId', verifyToken, toggleUserStatus);
router.patch('/instructors/:tutorId', verifyToken, toggleTutorStatus);
router.post('/add-tutor', upload.single('image'), addTutors);

//Category Management
router.get('/categories', verifyToken, getCategoriesPagination);
router.post('/categories', verifyToken, saveCategory);
router.put('/categories/:id', verifyToken, updateCategory);
router.patch('/categories/block/:id', verifyToken, deleteCategory);

//Course Management
router.patch('/courses/:courseId/status', verifyToken, courseStatus);
router.get('/courses/stats', verifyToken, getCourseDatas);
router.get('/courses/:courseId', verifyToken, getViewCourses);
router.patch('/courses/:courseId/publish', verifyToken, publishCourse);
router.patch('/courses/:courseId/reject', verifyToken, rejectCourse);
router.post('/courses/:courseId/reviews', verifyToken, addReview);
router.get('/courses/:courseId/reviews', verifyToken, getReviews);
router.get('/instructors/:instructorId/profile', verifyToken, getInstructorData);

//Order Management
router.get("/orders", verifyToken, orderController.getOrders.bind(orderController));
router.get("/orders/:orderId", verifyToken, orderController.getOrderDetail.bind(orderController));

//Analytics Management
router.get('/analytics/dashboard-stats', verifyToken, getAnalytics);
router.get('/analytics/revenue-analytics', verifyToken, getRevenueAnalytics);
router.get('/analytics/category-distribution', verifyToken, getCategoryDistribution);
router.get('/analytics/top-courses', verifyToken, getTopCourses);

export default router;
