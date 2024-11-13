import { Schema, model, Document } from 'mongoose';

export interface IInstructor extends Document {
    username: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    image?: string;
    address?: {
        line1: string;
        line2: string;
    };
    gender?: string;
    dob?: string;
}

const instructorSchema = new Schema<IInstructor>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'instructor' },
    phone: { type: String },
    image: { type: String },
    address: {
        line1: { type: String },
        line2: { type: String }
    },
    gender: { type: String },
    dob: { type: Date }
});

export default model<IInstructor>('Instructor', instructorSchema);
