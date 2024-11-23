import { ObjectId,Document } from 'mongoose';

export interface Address {
    line1: string;
    line2: string;
}

export interface IAdmin extends Document {
    _id: ObjectId; 
    username: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    image?: string | null;
    address?: Address;
    gender?: string;
    dob?: string;
}