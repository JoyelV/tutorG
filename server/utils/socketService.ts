import { Server, Socket } from 'socket.io';
import { logger } from './logger';
import Message from '../models/Message';

class SocketService {
    private io: Server | null = null;
    private onlineUsers: Map<string, string> = new Map(); // userId -> socketId

    public init(ioInstance: Server): void {
        this.io = ioInstance;
        this.setupEventHandlers();
        logger.info('SocketService initialized');
    }

    private setupEventHandlers(): void {
        if (!this.io) return;

        this.io.on('connection', (socket: Socket) => {
            logger.info(`Socket connected: ${socket.id}`);

            socket.on("joinChatRoom", ({ sender, receiver }) => {
                if (!sender || !receiver) {
                    logger.error('Invalid room data:', { sender, receiver });
                    return;
                }
                const roomName = [sender, receiver].sort().join("-");
                socket.join(roomName);
            });

            socket.on('send_message', async (data: {
                sender: string,
                receiver: string,
                content: string,
                senderModel: string,
                receiverModel: string,
                mediaUrl?: string,
                messageId: string
            }) => {
                const { sender, receiver, content, senderModel, receiverModel, mediaUrl, messageId } = data;

                if (!sender || !receiver) {
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
                    this.io?.to(roomName).emit("receive_message", {
                        id: message._id,
                        sender: message.sender,
                        content: message.content,
                        time: message.createdAt,
                        status: message.status,
                        mediaUrl: message.mediaUrl,
                        messageId: messageId
                    });
                } catch (error) {
                    logger.error('Error sending message:', error);
                    socket.emit('error', 'Failed to send message');
                }
            });

            socket.on('message_read', async (messageId: string) => {
                try {
                    await Message.findOneAndUpdate(
                        { messageId: messageId },
                        { status: 'read' }
                    );
                    this.io?.emit('message_read_update', { id: messageId, status: 'read' });
                } catch (err) {
                    logger.error('Error marking message as read:', err);
                }
            });

            socket.on('typing', (data: { sender: string, receiver: string }) => {
                const roomName = [data.sender, data.receiver].sort().join("-");
                socket.to(roomName).emit('user_typing', { sender: data.sender });
            });

            socket.on('stop_typing', (data: { sender: string, receiver: string }) => {
                const roomName = [data.sender, data.receiver].sort().join("-");
                socket.to(roomName).emit('user_stop_typing', { sender: data.sender });
            });

            socket.on('start_call', (data: { senderId: string, receiverId: string, roomId: string, senderName: string }) => {
                this.io?.to(`notifications-${data.receiverId}`).emit('incoming_call', data);
            });

            socket.on('disconnect', () => {
                let disconnectedUserId: string | null = null;
                for (const [userId, socketId] of this.onlineUsers.entries()) {
                    if (socketId === socket.id) {
                        disconnectedUserId = userId;
                        break;
                    }
                }
                if (disconnectedUserId) {
                    this.onlineUsers.delete(disconnectedUserId);
                    this.io?.emit('user_status_update', { userId: disconnectedUserId, status: 'offline' });
                    logger.info(`User ${disconnectedUserId} went offline`);
                }
                logger.info('Socket disconnected');
            });
        });
    }

    public emitNotification(userId: string, data: { title: string; message: string; type: string }): void {
        if (this.io) {
            this.io.to(`notifications-${userId}`).emit('notification', data);
            logger.info(`Real-time notification sent to user ${userId}`);
        } else {
            logger.warn('SocketService not initialized, notification could not be sent');
        }
    }

    public emitToAll(event: string, data: any): void {
        this.io?.emit(event, data);
    }
}

export const socketService = new SocketService();
