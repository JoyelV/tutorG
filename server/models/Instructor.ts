import { Schema, model, Document } from 'mongoose';

interface Address {
    line1: string;
    line2: string;
}

interface SocialLinks {
    website?: string;
    linkedIn?: string;
    youtube?: string;
    facebook?: string;
}

export interface IInstructor extends Document {
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



















// import { Schema, model, Document } from 'mongoose';

// export interface IInstructor extends Document {
//     username: string;
//     email: string;
//     password: string;
//     role?: string;
//     phone?: string;
//     image?: string;
//     address?: {
//         line1: string;
//         line2: string;
//     };
//     gender?: string;
//     dob?: string;
// }

// const instructorSchema = new Schema<IInstructor>({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, default: 'instructor' },
//     phone: { type: String },
//     image: { type: String },
//     address: {
//         line1: { type: String },
//         line2: { type: String }
//     },
//     gender: { type: String },
//     dob: { type: Date }
// });