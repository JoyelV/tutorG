import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { auth } = useAuth();

    useEffect(() => {
        if (auth && auth.token) {
            const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const newSocket = io(socketUrl, {
                auth: { token: auth.token },
                withCredentials: true,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                if (auth.userId) {
                    newSocket.emit('joinNotifications', auth.userId);
                }
            });

            newSocket.on('notification', (data: { title: string; message: string; type: string }) => {
                const toastOptions = {
                    position: "top-right" as const,
                    autoClose: 5000,
                };

                switch (data.type) {
                    case 'success':
                        toast.success(`${data.title}: ${data.message}`, toastOptions);
                        break;
                    case 'error':
                        toast.error(`${data.title}: ${data.message}`, toastOptions);
                        break;
                    case 'info':
                    default:
                        toast.info(`${data.title}: ${data.message}`, toastOptions);
                        break;
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [auth]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
