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
import { deleteCategory, getCategoriesPagination, saveCategory } from '../controllers/categoryController';
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
router.get('/users',verifyToken,getAllUsers);
router.get('/instructors',verifyToken,getAllInstructors);
router.patch('/users/:userId', verifyToken,toggleUserStatus);
router.patch('/instructors/:tutorId',verifyToken,toggleTutorStatus);
router.post('/add-tutor', upload.single('image'), addTutors);

//Category Management
router.get('/categories',verifyToken, getCategoriesPagination);
router.post('/categories',verifyToken,saveCategory);
router.put('/categories/:id',verifyToken,saveCategory);
router.patch('/categories/block/:id', verifyToken,deleteCategory);

//Course Management
router.patch('/course-status/:courseId',verifyToken,courseStatus);
router.get('/courseData',verifyToken,getCourseDatas);
router.get('/courseDetailview/:courseId',verifyToken,getViewCourses);
router.put('/publish/:courseId',verifyToken,publishCourse);
router.put('/reject/:courseId',verifyToken,rejectCourse);
router.post('/courses/:courseId',verifyToken,addReview);
router.get('/reviews/:courseId',verifyToken,getReviews);
router.get('/instructorProfile/:instructorId',verifyToken,getInstructorData);

//Order Management
router.get("/orders", verifyToken,getOrders);
router.get("/order-view/:orderId", verifyToken,getOrderDetail);

export default router;
