import mongoose, { Schema } from "mongoose";
import { ICourse } from "../entities/ICourse";

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  language: { type: String },
  level: { type: String, required: true },
  duration: { type: Number, required: true },
  courseFee: { type: Number, required: true },
  thumbnail: { type: String, default: "" },
  trailer: { type: String, default: "" },
  description: { type: String, required: true },
  learningPoints: { type: String, required: true },
  targetAudience: { type: String, required: true },
  requirements: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor", required: true },
  status: { type: String, enum: ["draft", "reviewed", "published","rejected"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  ratingsAndFeedback: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
      rating: { type: Number, required: true, min: 1, max: 5 }, 
      feedback: { type: String, default: "" }, 
    }
  ],
  averageRating: { type: Number, default: 0 }, 
  isApproved: { type: Boolean, default: false },
});

CourseSchema.methods.calculateAverageRating = async function () {
  if (this.ratingsAndFeedback.length === 0) {
    this.averageRating = 0;
  } else {
    const totalRating = this.ratingsAndFeedback.reduce((sum:any, entry:any) => sum + entry.rating, 0);
    this.averageRating = totalRating / this.ratingsAndFeedback.length;
  }
  await this.save();
};

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
