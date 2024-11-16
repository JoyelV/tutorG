import { Schema, model } from 'mongoose';
import { IUser } from '../entities/IUser';

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    phone: { type: String },
    image: { type: String },
    address: {
        line1: { type: String },
        line2: { type: String },
    },
    gender: { type: String },
    dob: { type: Date },
    isBlocked: { type: Boolean, default: false },
});

export default model<IUser>('User', userSchema);
