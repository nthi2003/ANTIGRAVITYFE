import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { userService } from '../services/userService';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    timestamp: string;
    read: boolean;
    goalId?: string; // For navigation to goal detail
}

interface NotificationContextType {
    connected: boolean;
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    useEffect(() => {
        let stompClient: Client | null = null;

        const connect = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const user = await userService.getMe();
                if (!user) return;

                const socket = new SockJS('http://localhost:8080/ws');
                stompClient = new Client({
                    webSocketFactory: () => socket,
                    connectHeaders: {
                        Authorization: `Bearer ${token}`
                    },
                    debug: (str) => {
                        console.log('STOMP: ' + str);
                    },
                    onConnect: () => {
                        console.log('Connected to WebSocket');
                        setConnected(true);

                        stompClient?.subscribe('/user/queue/notifications', (message) => {
                            const data = JSON.parse(message.body);
                            const newNotification: Notification = {
                                id: Math.random().toString(36).substr(2, 9),
                                title: data.title,
                                message: data.message,
                                type: data.type,
                                timestamp: data.timestamp || new Date().toISOString(),
                                read: false,
                                goalId: data.goalId // Include goalId for navigation
                            };

                            setNotifications(prev => [newNotification, ...prev]);

                            toast.info(newNotification.title, {
                                description: newNotification.message,
                                duration: 5000,
                            });
                        });
                    },
                    onStompError: (frame) => {
                        console.error('Broker reported error: ' + frame.headers['message']);
                        console.error('Additional details: ' + frame.body);
                    },
                    onDisconnect: () => {
                        console.log('Disconnected from WebSocket');
                        setConnected(false);
                    },
                });

                stompClient.activate();
            } catch (error) {
                console.error('WebSocket connection error:', error);
            }
        };

        connect();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ connected, notifications, unreadCount, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
