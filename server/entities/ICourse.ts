import { Document,Types } from 'mongoose';

export interface ICourse extends Document{
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language:  "English" | "Malalayam" | "Hindi";
  level: string;
  duration: number;
  courseFee: number;
  thumbnail: string;
  trailer: string;
  description: string;
  instructorId: Types.ObjectId;
  status: "draft" | "submitted" | "published";
  createdAt: Date;
  students: Types.ObjectId[];  
  rating: number;
  isApproved: boolean;
}
