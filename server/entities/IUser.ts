import { ObjectId } from 'mongoose';

export interface IUser {
    _id: ObjectId; 
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
    isBlocked: boolean;
}
