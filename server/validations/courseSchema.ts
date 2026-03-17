import { z } from 'zod';

export const createCourseSchema = z.object({
    body: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters long').max(100),
        subtitle: z.string().min(10, 'Subtitle must be at least 10 characters long').max(200),
        description: z.string().min(20, 'Description must be at least 20 characters long'),
        category: z.string().min(1, 'Category is required'),
        level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
        courseFee: z.number().min(0, 'Course fee cannot be negative'),
        language: z.string().min(1, 'Language is required'),
    }),
});

export const updateCourseSchema = z.object({
    params: z.object({
        courseId: z.string().min(1, 'Course ID is required'),
    }),
    body: z.object({
        title: z.string().min(5).max(100).optional(),
        subtitle: z.string().min(10).max(200).optional(),
        description: z.string().min(20).optional(),
        category: z.string().optional(),
        level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
        courseFee: z.number().min(0).optional(),
        language: z.string().optional(),
    }),
});

export const addLessonSchema = z.object({
    body: z.object({
        courseId: z.string().min(1, 'Course ID is required'),
        title: z.string().min(3, 'Lesson title must be at least 3 characters long'),
        description: z.string().min(10, 'Lesson description must be at least 10 characters long'),
        videoUrl: z.string().url('Invalid video URL').optional(),
    }),
});
