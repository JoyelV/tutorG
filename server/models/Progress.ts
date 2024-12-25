import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  studentId: mongoose.Schema.Types.ObjectId;
  completedLessons: mongoose.Schema.Types.ObjectId[];
  completionDate?: Date;
}

const ProgressSchema = new Schema<IProgress>({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completionDate: { type: Date },
});

const Progress = mongoose.model<IProgress>('Progress', ProgressSchema);
export default Progress;
