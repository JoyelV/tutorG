import mongoose, { Document, Schema, Model, model } from 'mongoose';

interface IChat extends Document {
    members: mongoose.Types.ObjectId[]; 
    lastMessage: mongoose.Types.ObjectId; 
    unreadMessageCount: number; 
    createdAt?: Date; 
    updatedAt?: Date; 
}

const chatSchema = new Schema<IChat>(
    {
        members: [
            { type: Schema.Types.ObjectId, ref: 'users' }
        ],
        lastMessage: { type: Schema.Types.ObjectId, ref: 'messages' },
        unreadMessageCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Chat: Model<IChat> = model<IChat>('chats', chatSchema);

export default Chat;
