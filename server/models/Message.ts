import mongoose, { Schema, Document, Model, model } from 'mongoose';

interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId; 
    sender: mongoose.Types.ObjectId; 
    text?: string; 
    image?: string; 
    read: boolean; 
    createdAt?: Date; 
    updatedAt?: Date; 
}

const messageSchema = new Schema<IMessage>(
    {
        chatId: { type: Schema.Types.ObjectId, ref: 'chats', required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        text: { type: String },
        image: { type: String },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message: Model<IMessage> = model<IMessage>('messages', messageSchema);

export default Message;
