import { Schema, model } from 'mongoose';
import { IInstructor } from '../entities/IInstructor';

const instructorSchema = new Schema<IInstructor>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'instructor' },
    phone: { type: String },
    image: { type: String },
    address: {
        line1: { type: String },
        line2: { type: String },
    },
    gender: { type: String },
    dob: { type: String },
    bio: { type: String },
    headline: { type: String },
    areasOfExpertise: { type: String },
    highestQualification: { type: String },
    socialLinks: {
        website: { type: String },
        linkedIn: { type: String },
        youtube: { type: String },
        facebook: { type: String },
    },
    isBlocked: { type: Boolean, default: false },
});

export default model<IInstructor>('Instructor', instructorSchema);
