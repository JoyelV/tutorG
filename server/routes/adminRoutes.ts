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
import { deleteCategory, getCategories, saveCategory } from '../controllers/categoryController';
import { courseStatus, getCourses, getViewChapters, getViewCourses } from '../controllers/courseController';

const router = Router();

// AUTHENTICATION
router.post('/login', login); 
router.post('/send-otp', sendOtp);
router.post('/verify-otp',verifyPasswordOtp );
router.post('/reset-password', resetPassword);

//PROFILE MANAGEMENT
router.get('/profile/:userId',fetchUserProfile);
router.put('/update/:userId', editUserProfile);
router.put('/update-password/:userId', editPassword);
router.put('/upload-image/:userId', upload.single('image'), uploadImage);

//Student & Tutor Management
router.get('/users',getAllUsers);
router.get('/instructors',getAllInstructors);
router.patch('/users/:userId', toggleUserStatus);
router.patch('/instructors/:tutorId',toggleTutorStatus);
router.post('/add-tutor', upload.single('image'), addTutors);

//Category Management
router.get('/categories', getCategories);
router.post('/categories',saveCategory);
router.put('/categories/:id',saveCategory);
router.patch('/categories/block/:id', deleteCategory);

//Course Management
router.patch('/course-status/:id',courseStatus);
router.get('/courseData',getCourses);
router.get('/courseDetailview/:id',getViewCourses);

export default router;
