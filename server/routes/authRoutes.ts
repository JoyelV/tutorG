import { Router } from 'express';
import { register, login, sendOtp, verifyOtp, resetPassword } from '../controllers/authController'; 

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login); 

authRoutes.post('/send-otp', sendOtp);
authRoutes.post('/verify-otp', verifyOtp);
authRoutes.post('/reset-password', resetPassword);

export default authRoutes; 

