import api from './api';

/**
 * Admin Service
 * Handles all management API calls for Administrators.
 * Uses the NEW RESTful routes.
 */
export const adminService = {
    // Admin Profile & Auth
    getAdminProfile: () => api.get('/admin/profile'),
    updateAdminProfile: (data: any) => api.put('/admin/profile', data),
    updateAdminPassword: (data: any) => api.put('/admin/profile/password', data),
    updateAdminImage: (formData: FormData) => api.put('/admin/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // User & Instructor Management
    getAllUsers: () => api.get('/admin/users'),
    getAllInstructors: () => api.get('/admin/instructors'),
    toggleUserStatus: (userId: string) => api.patch(`/admin/users/${userId}`),
    toggleInstructorStatus: (tutorId: string) => api.patch(`/admin/instructors/${tutorId}`),
    addTutor: (formData: FormData) => api.post('/admin/add-tutor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    saveQA: (formData: FormData) => api.post('/admin/add-qa', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getQA: (id: string) => api.get(`/admin/qa/${id}`),
    updateQA: (id: string, formData: FormData) => api.put(`/admin/qa/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Category Management
    getCategories: (params?: any) => api.get('/admin/categories', { params }),
    saveCategory: (data: any) => api.post('/admin/categories', data),
    updateCategory: (id: string, data: any) => api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id: string) => api.patch(`/admin/categories/block/${id}`),

    // Course Management
    updateCourseStatus: (courseId: string) => api.patch(`/admin/courses/${courseId}/status`),
    getCourseStats: (params?: any) => api.get('/admin/courses/stats', { params }),
    getCourseDetails: (courseId: string) => api.get(`/admin/courses/${courseId}`),
    publishCourse: (courseId: string) => api.patch(`/admin/courses/${courseId}/publish`),
    rejectCourse: (courseId: string) => api.patch(`/admin/courses/${courseId}/reject`),
    addCourseReview: (courseId: string, data: any) => api.post(`/admin/courses/${courseId}/reviews`, data),
    getCourseReviews: (courseId: string) => api.get(`/admin/courses/${courseId}/reviews`),
    getInstructorProfile: (instructorId: string) => api.get(`/admin/instructors/${instructorId}/profile`),

    // Order Management
    getOrders: (params?: any) => api.get('/admin/orders', { params }),
    getOrderDetail: (orderId: string) => api.get(`/admin/orders/${orderId}`),

    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard-stats'),
    getSalesData: () => api.get('/admin/sales-data'),
};
