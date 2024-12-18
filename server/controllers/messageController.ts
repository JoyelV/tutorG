import { Request, Response } from 'express';
import Chat from '../models/Chat';
import Message from '../models/Message';

export const createNewMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        await Chat.findByIdAndUpdate(
            req.body.chatId,
            {
                lastMessage: savedMessage._id,
                $inc: { unreadMessageCount: 1 },
            },
            { new: true }
        );

        res.status(201).send({
            message: 'Message sent successfully',
            success: true,
            data: savedMessage,
        });
    } catch (error) {
        res.status(400).send({
            message: error instanceof Error ? error.message : 'An error occurred',
            success: false,
        });
    }
};

export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const allMessages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
        res.send({
            message: 'Messages fetched successfully',
            success: true,
            data: allMessages,
        });
    } catch (error) {
        res.status(400).send({
            message: error instanceof Error ? error.message : 'An error occurred',
            success: false,
        });
    }
};
