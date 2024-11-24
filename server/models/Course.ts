import mongoose, { Schema } from "mongoose";
import { ICourse } from "../entities/ICourse";

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String},
  language: { type: String },
  level: { type: String, required: true },
  duration: { type: Number, required: true },
  courseFee: { type: Number, required: true },
  thumbnail: { type: String, default: "" },
  trailer: { type: String, default: "" },
  description: { type: String, required: true },
  learningPoints:{ type: String, required: true },
  targetAudience: { type: String, required: true },
  requirements: { type: String, required: true },
  feedback: { type: String, default: "" },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor", required: true },
  status: { type: String, enum: ["draft", "submitted", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rating: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }
});

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
