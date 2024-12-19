import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  content: string;
  status: 'sent' | 'delivered' | 'read'; // New field for status
  mediaUrl?: string;
  senderModel: 'User' | 'Instructor'; 
  receiverModel: 'User' | 'Instructor'; 
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverModel' },
    content: { type: String, required: false },
    status: { type: String, required: true, default: 'sent', enum: ['sent', 'delivered', 'read'] }, // Status field
    mediaUrl: { type: String }, 
    senderModel: { type: String, required: true, enum: ['User', 'Instructor'] },
    receiverModel: { type: String, required: true, enum: ['User', 'Instructor'] },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
