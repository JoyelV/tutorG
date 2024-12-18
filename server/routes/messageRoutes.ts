import express from 'express';
import { createNewMessage, getAllMessages } from '../controllers/messageController';

const router = express.Router();

router.post('/new-message', createNewMessage);
router.get('/get-all-messages/:chatId', getAllMessages);

export default router;
