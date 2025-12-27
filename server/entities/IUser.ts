// import { ObjectId,Document } from 'mongoose';

// export interface IUser extends Document {
//     _id: ObjectId; 
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
//     isBlocked: boolean;
//     onlineStatus: boolean;
// }

import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
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
  onlineStatus: boolean;
}