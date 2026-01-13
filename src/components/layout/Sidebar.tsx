import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, X, Shield, Bell, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userService, type User as UserType } from '../../services/userService';
import { useEffect, useState } from 'react';
import { History } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<UserType | null>(null);

    useEffect(() => {
        if (isOpen && !userData) {
            userService.getMe().then(setUserData).catch(console.error);
        }
    }, [isOpen, userData]);

    const menuItems = [
        { icon: User, label: t('profile'), path: '/profile' },
        { icon: History, label: 'Lịch sử giao dịch', path: '/transactions' },
        { icon: Bell, label: 'Thông báo', path: '/notifications' },
        { icon: Shield, label: 'Bảo mật', path: '/security' },
        { icon: Settings, label: 'Cài đặt', path: '/settings' },
        { icon: HelpCircle, label: 'Hỗ trợ', path: '/help' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                                    {userData?.fullName?.charAt(0) || userData?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{userData?.fullName || userData?.username || 'User'}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">@{userData?.username}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm
                                        ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}
                                    `}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                            >
                                <LogOut size={20} />
                                Đăng xuất
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
