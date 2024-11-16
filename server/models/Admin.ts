import { Schema, model } from 'mongoose';
import { IAdmin } from '../entities/IAdmin';

const adminSchema = new Schema<IAdmin>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    phone: { type: String },
    image: { type: String, default: null },
    address: {
        line1: { type: String },
        line2: { type: String },
    },
    gender: { type: String },
    dob: { type: Date },
});

export default model<IAdmin>('Admin', adminSchema);
