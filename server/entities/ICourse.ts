import { Document,Types } from 'mongoose';

export interface ICourse extends Document{
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language:  string;
  level: string;
  duration: number;
  courseFee: number;
  thumbnail: string;
  trailer: string;
  description: string;
  learningPoints:string;
  targetAudience:string;
  feedback:string;
  requirements:string;
  instructorId: Types.ObjectId;
  status: "draft" | "submitted" | "published";
  createdAt: Date;
  students: Types.ObjectId[];  
  rating: number;
  isApproved: boolean;
}
