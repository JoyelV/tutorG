import { ObjectId } from 'mongoose';

export interface Address {
    line1: string;
    line2: string;
}

export interface SocialLinks {
    website?: string;
    linkedIn?: string;
    youtube?: string;
    facebook?: string;
}

export interface IInstructor {
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
    headline?: string;
    areasOfExpertise?: string;
    highestQualification?: string;
    socialLinks?: SocialLinks;
    isBlocked: boolean;
}
