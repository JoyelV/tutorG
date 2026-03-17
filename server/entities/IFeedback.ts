import { Document, Types } from 'mongoose';

export interface IFeedback extends Document {
    courseId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}
