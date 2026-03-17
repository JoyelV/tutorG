import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import Feedback from '../models/Feedback';

dotenv.config();

async function migrateFeedback() {
    const MONGO_URI = process.env.MONGO_URI || '';
    if (!MONGO_URI) {
        console.error('MONGO_URI not found in environment');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for migration...');

        const courses = await Course.find({ 'ratingsAndFeedback.0': { $exists: true } });
        console.log(`Found ${courses.length} courses with embedded feedback to migrate.`);

        for (const course of courses) {
            console.log(`Migrating feedback for course: ${course.title}`);

            const feedbacks = (course as any).ratingsAndFeedback;
            if (feedbacks && feedbacks.length > 0) {
                for (const f of feedbacks) {
                    await Feedback.findOneAndUpdate(
                        { courseId: course._id, userId: f.userId },
                        {
                            rating: f.rating,
                            feedback: f.feedback,
                            createdAt: f.createdAt || new Date(),
                            updatedAt: f.updatedAt || f.createdAt || new Date()
                        },
                        { upsert: true }
                    );
                }

                // Update course stats
                course.reviewCount = feedbacks.length;
                const totalRating = feedbacks.reduce((acc: number, curr: any) => acc + curr.rating, 0);
                course.averageRating = totalRating / feedbacks.length;

                // Remove embedded feedback after successful migration
                // Note: Course model already had this removed from its schema, but MongoDB might still have the data
                // Using $unset to be sure
                await Course.updateOne(
                    { _id: course._id },
                    {
                        $set: {
                            reviewCount: course.reviewCount,
                            averageRating: course.averageRating
                        },
                        $unset: { ratingsAndFeedback: "" }
                    }
                );
            }
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateFeedback();
