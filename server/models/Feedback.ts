import mongoose, { Schema } from 'mongoose';
import { IFeedback } from '../entities/IFeedback';

const FeedbackSchema = new Schema<IFeedback>(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        feedback: { type: String, default: '' },
    },
    { timestamps: true }
);

// Index to ensure a user can only leave one feedback per course and for fast lookups
FeedbackSchema.index({ courseId: 1, userId: 1 }, { unique: true });

const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
