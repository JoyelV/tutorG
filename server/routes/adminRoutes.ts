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
import { toggleTutorStatus } from '../controllers/instructorController';
import { deleteCategory, getCategories, saveCategory } from '../controllers/categoryController';

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
router.get('/users', getAllUsers);
router.get('/instructors', getAllInstructors);
router.patch('/users/:userId', toggleUserStatus);
router.patch('/instructors/:tutorId', toggleTutorStatus);

//Category Management
/**
 * @route   GET /admin/categories
 * @desc    Fetch all categories and subcategories
 * @access  Admin
 */
router.get('/categories', getCategories);

/**
 * @route   POST /admin/categories
 * @desc    Add a new category with subcategories
 * @access  Admin
 */
router.post('/categories', saveCategory);

/**
 * @route   PUT /admin/categories/:id
 * @desc    Edit an existing category and its subcategories
 * @access  Admin
 */
router.put('/categories/:id', saveCategory);

/**
 * @route   DELETE /admin/categories/:id
 * @desc    Delete a category and its subcategories
 * @access  Admin
 */
router.patch('/categories/block/:id', deleteCategory);

export default router;
