import ReviewRepository from '../repositories/reviewRepository';

class ReviewService {
    async addReview(title: string, material: string, comment: string, courseId: string) {
        const existingReview = await ReviewRepository.findReviewByCourseId(courseId);

        if (existingReview) {
            return { status: 200, message: 'A review already exists for this course.' };
        }

        await ReviewRepository.addReview(title, material, comment, courseId);

        const course = await ReviewRepository.findCourseById(courseId);
        if (!course) {
            return { status: 404, message: 'Course not found' };
        }

        await ReviewRepository.updateCourseStatus(courseId, 'reviewed');
        return { status: 201, message: 'Review submitted successfully!' };
    }

    async getReviews(courseId: string) {
        return await ReviewRepository.getReviewsByCourseId(courseId);
    }
}

export default new ReviewService();
