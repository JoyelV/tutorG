import { Document, Types } from "mongoose";
import { IUser } from "./IUser"; 

export interface ICourse extends Document {
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language: string;
  level: string;
  duration: number;
  courseFee: number;
  thumbnail: string;
  trailer: string;
  description: string;
  learningPoints: string;
  targetAudience: string;
  requirements: string;
  instructorId: Types.ObjectId;
  status: "draft" | "reviewed" | "published" | "rejected";
  createdAt: Date;
  students: Types.ObjectId[];
  ratingsAndFeedback: {
    userId: IUser;
    rating: number;
    feedback: string;
  }[];
  averageRating: number;
  isApproved: boolean;

  calculateAverageRating: () => Promise<void>;
}
