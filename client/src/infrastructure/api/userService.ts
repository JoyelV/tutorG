import api from './api';

/**
 * User Service
 * Handles all API calls related to User profiles, Authentication, Cart, and Wishlist.
 * Uses the NEW RESTful routes.
 */
export const userService = {
    // Profile Management
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data: any) => api.put('/user/profile', data),
    updatePassword: (data: any) => api.put('/user/update-password', data),
    updateImage: (formData: FormData) => api.put('/user/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getProfileImage: () => api.get('/user/profile/image'),
    getMyTutors: () => api.get('/user/my-tutors'),

    // Cart
    getCart: () => api.get('/user/cart'),
    addToCart: (courseId: string) => api.post('/user/cart', { courseId }),
    removeFromCart: (cartItemId: string) => api.delete(`/user/cart/${cartItemId}`),

    // Wishlist
    getWishlist: () => api.get('/user/wishlist'),
    addToWishlist: (courseId: string) => api.post('/user/wishlist', { courseId }),
    removeFromWishlist: (wishlistItemId: string) => api.delete(`/user/wishlist/${wishlistItemId}`),

    // Stats & Dashboard
    getDashboardStats: () => api.get('/user/dashboard-courseData'),
    getStats: () => api.get('/user/stats'),

    // Chat & Notifications
    getMessages: (params?: any) => api.get('/user/messages', { params }),
    getNotifications: () => api.get('/user/notifications'),

    // Payments & Orders
    initiateStripePayment: (data: any) => api.post('/user/stripepayment', data),
    getOrders: () => api.get('/user/orders'),
    getPurchaseHistory: (params?: any) => api.get('/user/purchase-history', { params }),
    getOrderBySession: (sessionId: string) => api.get(`/user/getorders?session_id=${sessionId}`),

    // Certificates
    getCompletionCertificate: (courseId: string) => api.get(`/user/courses-complete/${courseId}`),
    downloadCertificate: (courseId: string) => api.get(`/user/courses/download-certificate/${courseId}`, {
        responseType: 'blob'
    }),
};
