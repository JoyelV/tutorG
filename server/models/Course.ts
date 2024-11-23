import mongoose, { Schema } from "mongoose";
import { ICourse } from "../entities/ICourse";

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, required: true },
  duration: { type: Number, required: true },
  thumbnail: { type: String, default: "" },
  trailer: { type: String, default: "" },
  description: { type: String, default: "" },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
