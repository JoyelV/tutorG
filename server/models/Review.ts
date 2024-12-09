import mongoose, { Document, Schema } from 'mongoose';

interface IReview extends Document {
  title: string;
  material: string;
  comment: string;
  courseId: mongoose.Types.ObjectId;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    title: { type: String, required: true },
    material: { type: String, required: true },
    comment: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },  
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
