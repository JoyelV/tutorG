import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import instructorRoutes from './routes/instructorRoutes';
import { handleStripeWebhook } from './controllers/paymentController';
import connectCloudinary from './config/cloudinary';
import path from 'path';
import cookieParser from 'cookie-parser';
import { refreshAccessToken } from './utils/VerifyToken';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message';

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://tutorg.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'https://tutorg.vercel.app',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

connectCloudinary();

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.post('/api/refresh-token', refreshAccessToken);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

io.use((socket, next) => {
  next();
});

io.on('connection', (socket) => {
  socket.on("joinChatRoom", ({ sender, receiver }) => {
    if (!sender || !receiver) {
      console.error('Invalid room data:', { sender, receiver });
      return;
    }

    const roomName = [sender, receiver].sort().join("-");
    socket.join(roomName);
 });

  socket.on('send_message', async (data: { sender: string, receiver: string, content: string, senderModel: string, receiverModel: string, mediaUrl?: string ,messageId:string}) => {

    const { sender, receiver, content, senderModel, receiverModel, mediaUrl,messageId } = data;

    if (!sender || !receiver ) {
      socket.emit('error', 'Invalid message data');
      return;
    }
    const roomName = [sender, receiver].sort().join("-");

    try {
      const message = new Message({
        sender,
        receiver,
        content,
        senderModel,
        receiverModel,
        mediaUrl: mediaUrl,
        status: 'sent',
        messageId,
      });

      await message.save();
      io.to(roomName).emit("receive_message", {
        id: message._id,
        sender: message.sender,
        content: message.content,
        time: message.createdAt,
        status: message.status,
        mediaUrl: message.mediaUrl,
        messageId:messageId
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('message_read', async (messageId) => {
    try {
      await Message.findOneAndUpdate(
        { messageId: messageId }, 
        { status: 'read' } 
      );      
      io.emit('message_read_update', { id: messageId, status: 'read' });
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));