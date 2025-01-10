import { ObjectId,Document } from 'mongoose';

export interface Address {
    line1: string;
    line2: string;
}

export interface Transaction {
    date:Date;
    method:string;
    status:string;
    amount:number;
}

export interface IInstructor extends Document {
    _id: ObjectId; 
    username: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    image?: string;
    address?: Address;
    gender?: string;
    dob?: string;
    bio?: string;
    about?:string;
    headline?: string;
    areasOfExpertise?: string;
    highestQualification?: string;
    isBlocked: boolean;
    earnings: Number;
    totalWithdrawals: Number;
    currentBalance: Number;
    onlineStatus: boolean;
    transactions?: Transaction[]; 
    averageRating:number;
    numberOfRatings:number;
}