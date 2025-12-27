import Review from '../models/Review';
import Course from '../models/Course';

class ReviewRepository {
    async findReviewByCourseId(courseId: string) {
        return await Review.findOne({ courseId });
    }

    async addReview(title: string, material: string, comment: string, courseId: string) {
        const newReview = new Review({ title, material, comment, courseId });
        return await newReview.save();
    }

    async findCourseById(courseId: string) {
        return await Course.findById(courseId);
    }

    async updateCourseStatus(courseId: string, status: string) {
        return await Course.findByIdAndUpdate(courseId, { status }, { new: true });
    }

    async getReviewsByCourseId(courseId: string) {
        return await Review.find({ courseId }).sort({ createdAt: -1 });
    }
}

export default new ReviewRepository();