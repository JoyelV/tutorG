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
  } 
from '../controllers/adminController';
import upload from '../config/multerConfig';
import { toggleUserStatus } from '../controllers/userController';
import { addTutors, toggleTutorStatus } from '../controllers/instructorController';
import { deleteCategory, getCategories, getCategoriesPagination, saveCategory } from '../controllers/categoryController';
import { courseStatus, getCourseDatas, getInstructorData, getViewCourses, publishCourse, rejectCourse } from '../controllers/courseController';
import { addReview, getReviews } from '../controllers/reviewController';
import { verifyToken } from '../utils/VerifyToken';
import { getOrderDetail, getOrders } from '../controllers/orderController';

const router = Router();

// AUTHENTICATION
router.post('/login', login); 
router.post('/send-otp', sendOtp);
router.post('/verify-otp',verifyPasswordOtp );
router.post('/reset-password', resetPassword);

//PROFILE MANAGEMENT
router.get('/profile',verifyToken, fetchUserProfile);
router.put('/update', verifyToken,editUserProfile);
router.put('/update-password',verifyToken, editPassword);
router.put('/upload-image', upload.single('image'), verifyToken,uploadImage);

//Student,QA & Tutor Management
router.get('/users',getAllUsers);
router.get('/instructors',getAllInstructors);
router.patch('/users/:userId', toggleUserStatus);
router.patch('/instructors/:tutorId',toggleTutorStatus);
router.post('/add-tutor', upload.single('image'), addTutors);

//Category Management
router.get('/categories', getCategoriesPagination);
router.post('/categories',saveCategory);
router.put('/categories/:id',saveCategory);
router.patch('/categories/block/:id', deleteCategory);

//Course Management
router.patch('/course-status/:courseId',courseStatus);
router.get('/courseData',getCourseDatas);
router.get('/courseDetailview/:courseId',getViewCourses);
router.put('/publish/:courseId',publishCourse);
router.put('/reject/:courseId',rejectCourse);
router.post('/courses/:courseId', addReview);
router.get('/reviews/:courseId',getReviews);
router.get('/instructorProfile/:instructorId',getInstructorData);

//Order Management
router.get("/orders", getOrders);
router.get("/order-view/:orderId", getOrderDetail);

export default router;
