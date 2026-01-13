import { useState, useRef, useEffect } from 'react';
import { Bell, X, Trash2, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, clearAll } = useNotification();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };


        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);

        // Navigate to goals page if it's a withdrawal request
        if (notification.type === 'WITHDRAWAL_REQUEST' && notification.goalId) {
            setIsOpen(false);
            navigate('/goals');
        }
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 max-h-[480px] bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 z-[100] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h3 className="font-black text-slate-800 tracking-tight">Thông báo</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bạn có {unreadCount} tin mới</p>
                            </div>
                            <div className="flex gap-2">
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                        title="Xóa tất cả"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar min-h-[100px]">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "p-4 rounded-[20px] transition-all cursor-pointer relative group",
                                            notification.read ? "bg-white opacity-60" : "bg-slate-50 hover:bg-slate-100 shadow-sm"
                                        )}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                notification.type === 'WITHDRAWAL_REQUEST' ? "bg-amber-100 text-amber-600" :
                                                    notification.type === 'WITHDRAWAL_STATUS_UPDATE' ? "bg-emerald-100 text-emerald-600" :
                                                        "bg-blue-100 text-blue-600"
                                            )}>
                                                {notification.type === 'WITHDRAWAL_REQUEST' ? <Bell size={18} /> : <CheckCircle2 size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-xs font-black text-slate-800 truncate pr-4">{notification.title}</h4>
                                                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{formatTime(notification.timestamp)}</span>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                        {!notification.read && (
                                            <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full" />
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                                        <Bell size={32} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-500">Chưa có thông báo nào</h4>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1">Các thông báo mới nhất sẽ xuất hiện ở đây.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 5 && (
                            <div className="p-3 text-center border-t border-slate-50 bg-slate-50/50">
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                    Xem tất cả báo cáo
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
