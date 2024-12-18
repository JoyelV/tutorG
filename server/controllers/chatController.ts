import { Request, Response } from 'express';
import Chat from '../models/Chat'
import Message from '../models/Message';

// Create New Chat
export const createNewChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const chat = new Chat(req.body);
        const savedChat = await chat.save();

        await savedChat.populate('members');

        res.status(201).send({
            message: 'Chat created successfully',
            success: true,
            data: savedChat,
        });
    } catch (error: any) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
};

// Get All Chats
export const getAllChats = async (req: Request, res: Response): Promise<void> => {
    try {
        const allChats = await Chat.find({ members: { $in: req.body.userId } })
            .populate('members')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).send({
            message: 'Chats fetched successfully',
            success: true,
            data: allChats,
        });
    } catch (error: any) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
};

// Clear Unread Messages
export const clearUnreadMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            res.status(404).send({
                message: 'No Chat found with given chat ID.',
                success: false,
            });
            return;
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { unreadMessageCount: 0 },
            { new: true }
        )
            .populate('members')
            .populate('lastMessage');

        await Message.updateMany(
            { chatId: chatId, read: false },
            { read: true }
        );

        res.status(200).send({
            message: 'Unread messages cleared successfully',
            success: true,
            data: updatedChat,
        });
    } catch (error: any) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
};
