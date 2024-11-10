import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
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

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    phone: { type: String },
    image: { type: String },
    address: {
        line1: { type: String },
        line2: { type: String }
    },
    gender: { type: String },
    dob: { type: Date }
});

export default model<IUser>('User', userSchema);
