import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  content: string;
  status: 'sent' | 'delivered' | 'read'; 
  mediaUrl?: {
    url: string;
    type: string;
  };
  senderModel: 'User' | 'Instructor'; 
  receiverModel: 'User' | 'Instructor'; 
  createdAt: Date;
  updatedAt: Date;
  messageId:string;
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverModel' },
    content: { type: String, required: false },
    status: { type: String, required: true, default: 'sent', enum: ['sent', 'delivered', 'read'] }, 
    mediaUrl: {
      url: {
        type: String,
      },
      type: {
        type: String,
        enum: ["image", "video","audio"],
      }
    },
    senderModel: { type: String, required: true, enum: ['User', 'Instructor'] },
    receiverModel: { type: String, required: true, enum: ['User', 'Instructor'] },
    messageId: { type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
