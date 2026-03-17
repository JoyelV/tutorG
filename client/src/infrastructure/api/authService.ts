import api from './api';

/**
 * Auth Service
 * Handles all Authentication related API calls for Students, Instructors, and Admins.
 */
export const authService = {
    // Student Auth
    register: (data: any) => api.post('/user/register', data),
    verifyRegisterOTP: (data: any) => api.post('/user/verify-registerotp', data),
    login: (data: any) => api.post('/user/login', data),
    googleLogin: (data: any) => api.post('/user/google-login', data),
    logout: () => api.post('/user/logout'),
    sendOtp: (data: any) => api.post('/user/send-otp', data),
    resendOtp: (data: any) => api.post('/user/resend-otp', data),
    verifyOtp: (data: any) => api.post('/user/verify-otp', data),
    resetPassword: (data: any) => api.post('/user/reset-password', data),

    // Instructor Auth
    instructorLogin: (data: any) => api.post('/instructor/login', data),
    instructorSendOtp: (data: any) => api.post('/instructor/send-otp', data),
    instructorResendOtp: (data: any) => api.post('/instructor/resend-otp', data),
    instructorVerifyOtp: (data: any) => api.post('/instructor/verify-otp', data),
    instructorResetPassword: (data: any) => api.post('/instructor/reset-password', data),

    // Admin Auth
    adminLogin: (data: any) => api.post('/admin/login', data),
    adminSendOtp: (data: any) => api.post('/admin/send-otp', data),
    adminVerifyOtp: (data: any) => api.post('/admin/verify-otp', data),
    adminResetPassword: (data: any) => api.post('/admin/reset-password', data),
};
