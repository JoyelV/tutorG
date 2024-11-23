import mongoose, { Document, Schema } from 'mongoose';

interface LessonDocument extends Document {
  course: mongoose.Schema.Types.ObjectId; // Reference to Course
  chapterName: string; // Chapter this lesson belongs to
  lessonTitle: string; // Title of the lesson
  videoUrl?: string; // Path to the uploaded video
  pdfAssignment?: string; // Path to the uploaded PDF assignment
  duration?: number; // Duration of the video in seconds
  isPublished: boolean; // Whether the lesson is published
}

const lessonSchema = new Schema<LessonDocument>(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    chapterName: { type: String, required: true }, // Links to the chapter in the course
    lessonTitle: { type: String, required: true },
    videoUrl: { type: String }, // File path for the uploaded video
    pdfAssignment: { type: String }, // File path for the PDF assignment
    duration: { type: Number }, // Duration of the lesson video in seconds
    isPublished: { type: Boolean, default: false }, // Publish status
  },
  { timestamps: true }
);

const Lesson = mongoose.model<LessonDocument>('Lesson', lessonSchema);
export default Lesson;
