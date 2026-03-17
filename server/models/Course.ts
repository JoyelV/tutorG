import mongoose, { Schema } from 'mongoose';
import { ICourse } from '../entities/ICourse';

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  language: { type: String },
  level: { type: String, required: true },
  duration: { type: Number, required: true },
  courseFee: { type: Number, required: true },
  thumbnail: { type: String, default: '' },
  trailer: { type: String, default: '' },
  description: { type: String, required: true },
  learningPoints: { type: String, required: true },
  targetAudience: { type: String, required: true },
  requirements: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  status: { type: String, enum: ['draft', 'reviewed', 'published', 'rejected'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
});

// Performance Indexes
CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ isApproved: 1, status: 1 });
CourseSchema.index({ title: 'text' });


const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
