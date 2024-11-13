import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
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

const adminSchema = new Schema<IAdmin>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    phone: { type: String },
    image: { type: String , default: null },
    address: {
        line1: { type: String },
        line2: { type: String }
    },
    gender: { type: String },
    dob: { type: Date }
});

export default model<IAdmin>('Admin', adminSchema);
