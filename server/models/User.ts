import { Schema, model } from 'mongoose';
import { IUser } from '../entities/IUser';

const UserSchema: Schema = new Schema({
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
  dob: { type: String },
  isBlocked: { type: Boolean, default: false },
  onlineStatus: { type: Boolean, default: false }, // Added field for online status
});

export default model<IUser>('User', UserSchema);