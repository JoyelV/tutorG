import api from './api';

/**
 * Course & Instructor Service
 * Handles all API calls related to Courses, Lessons, and Instructor specific actions.
 * Uses the NEW RESTful routes.
 */
export const courseService = {
    // Public Course Browsing
    getAllCourses: (params: any) => api.get('/user/courses', { params }),
    getCourseById: (id: string) => api.get(`/user/courses/${id}`),
    getRecentlyAdded: () => api.get('/user/courses/recent'),
    getRelatedCourses: (id: string) => api.get(`/user/related/${id}`),
    getCategories: () => api.get('/user/categories'),
    getInstructorProfile: (id: string) => api.get(`/user/instructors/${id}`),

    // Instructor Side
    getMyProfile: () => api.get('/instructor/profile'),
    updateMyProfile: (data: any) => api.put('/instructor/profile', data),
    updateMyPassword: (data: any) => api.put('/instructor/profile/password', data),
    updateMyImage: (formData: FormData) => api.put('/instructor/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getMyCourses: () => api.get('/instructor/courses'),
    createCourse: (data: any) => api.post('/instructor/courses', data),
    addCourse: (data: any) => api.post('/instructor/addCourse', data),
    getCourseView: (id: string) => api.get(`/instructor/courses/${id}`),
    updateCourse: (id: string, data: any) => api.put(`/instructor/courses/${id}`, data),
    deleteCourse: (id: string) => api.delete(`/instructor/courses/${id}`),

    // Lessons
    getCourseLessons: (courseId: string) => api.get(`/instructor/courses/${courseId}/lessons`),
    addLesson: (data: any) => api.post('/instructor/lessons', data),
    getLesson: (lessonId: string) => api.get(`/instructor/lessons/${lessonId}`),
    updateLesson: (lessonId: string, data: any) => api.put(`/instructor/lessons/${lessonId}`, data),
    deleteLesson: (lessonId: string) => api.delete(`/instructor/lessons/${lessonId}`),

    // Quizzes
    getQuizzesByCourse: (courseId: string) => api.get(`/instructor/quizzes/${courseId}`),
    getQuizById: (courseId: string, quizId: string) => api.get(`/instructor/quizzes/${courseId}/${quizId}`),
    addQuiz: (courseId: string, data: any) => api.post(`/instructor/quizzes/${courseId}`, data),
    updateQuiz: (courseId: string, quizId: string, data: any) => api.put(`/instructor/quizzes/${courseId}/${quizId}`, data),
    deleteQuiz: (courseId: string, quizId: string) => api.delete(`/instructor/quizzes/${courseId}/${quizId}`),

    // Messages
    getMessages: (params: any) => api.get('/instructor/messages', { params }),

    // Instructor Stats & Students
    getPublishedCoursesCount: () => api.get('/instructor/stats/courses-published'),
    getTotalCoursesCount: () => api.get('/instructor/stats/courses-total'),
    getStudentsStats: () => api.get('/instructor/stats/students-total'),
    getEarningsStats: () => api.get('/instructor/stats/earnings-total'),
    getEarningsDetails: () => api.get('/instructor/earnings/details'),
    getWithdrawals: () => api.get('/instructor/withdrawals'),
    getMyStudents: (params?: any) => api.get('/instructor/students', { params }),
    getStudentsChat: () => api.get('/instructor/students-chat'),
    createCheckoutSession: (data: any) => api.post('/instructor/create-checkout-session', data),
};


// adminService has been moved to its own file: ./adminService.ts
