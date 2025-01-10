"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const instructorRoutes_1 = __importDefault(require("./routes/instructorRoutes"));
const paymentController_1 = require("./controllers/paymentController");
const cloudinary_1 = __importDefault(require("./config/cloudinary"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const VerifyToken_1 = require("./utils/VerifyToken");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Message_1 = __importDefault(require("./models/Message"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
const MONGO_URI = process.env.MONGO_URI || '';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
(0, cloudinary_1.default)();
app.use('/api/user', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/instructor', instructorRoutes_1.default);
app.post('/stripe-webhook', express_1.default.raw({ type: 'application/json' }), paymentController_1.handleStripeWebhook);
app.post('/api/refresh-token', VerifyToken_1.refreshAccessToken);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
exports.io.use((socket, next) => {
    next();
});
exports.io.on('connection', (socket) => {
    socket.on("joinChatRoom", ({ sender, receiver }) => {
        if (!sender || !receiver) {
            console.error('Invalid room data:', { sender, receiver });
            return;
        }
        const roomName = [sender, receiver].sort().join("-");
        socket.join(roomName);
    });
    socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { sender, receiver, content, senderModel, receiverModel, mediaUrl, messageId } = data;
        if (!sender || !receiver) {
            socket.emit('error', 'Invalid message data');
            return;
        }
        const roomName = [sender, receiver].sort().join("-");
        try {
            const message = new Message_1.default({
                sender,
                receiver,
                content,
                senderModel,
                receiverModel,
                mediaUrl: mediaUrl,
                status: 'sent',
                messageId,
            });
            yield message.save();
            exports.io.to(roomName).emit("receive_message", {
                id: message._id,
                sender: message.sender,
                content: message.content,
                time: message.createdAt.toLocaleTimeString(),
                status: message.status,
                mediaUrl: message.mediaUrl,
                messageId: messageId
            });
        }
        catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Failed to send message');
        }
    }));
    socket.on('message_read', (messageId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Message_1.default.findOneAndUpdate({ messageId: messageId }, { status: 'read' });
            exports.io.emit('message_read_update', { id: messageId, status: 'read' });
        }
        catch (err) {
            console.error('Error marking message as read:', err);
        }
    }));
    socket.on('disconnect', () => {
    });
});
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
