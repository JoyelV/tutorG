import { Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    language: string;
    level: string;
    duration: number;
    thumbnail?: string;
    trailer?: string;
    description?: string;
    status: "draft" | "published";
    createdAt: Date;
  }