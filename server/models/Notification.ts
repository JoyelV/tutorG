import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  tutorId: mongoose.Schema.Types.ObjectId;
  title: string;
  subtitle: string;
  thumbnail: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: '07d' }, // TTL
});

export default mongoose.model<INotification>('Notification', NotificationSchema);