import express from 'express';
import {
    createNewChat,
    getAllChats,
    clearUnreadMessages
} from '../controllers/chatController';

const router = express.Router();

router.post('/create-new-chat', createNewChat);
router.get('/get-all-chats', getAllChats);
router.post('/clear-unread-message', clearUnreadMessages);

export default router;
