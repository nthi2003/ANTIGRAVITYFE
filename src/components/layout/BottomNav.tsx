import { NavLink } from 'react-router-dom';
import { Home, Plus, Target, Wallet, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';

export const BottomNav = () => {
    const { t } = useTranslation();
    const navItems = [
        { icon: Home, label: t('dashboard'), path: '/' },
        { icon: Target, label: t('goals'), path: '/goals' },
        { icon: Plus, label: t('add_transaction'), path: '/add', isFab: true },
        { icon: Users, label: 'Bạn bè', path: '/social' },
        { icon: Wallet, label: 'Tài khoản', path: '/accounts' },
    ];

    return (
        <div className="bg-white border-t border-slate-100 z-50 pb-safe">
            <nav className="flex items-center justify-around px-2 h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }: { isActive: boolean }) => cn(
                            "flex items-center justify-center transition-all duration-300",
                            item.isFab
                                ? "relative z-10 -mt-10 bg-primary text-white shadow-xl shadow-primary/40 rounded-full h-16 w-16 border-4 border-slate-50 active:scale-90"
                                : isActive ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600"
                        )}
                        title={item.label}
                    >
                        <item.icon className={cn(item.isFab ? "w-8 h-8" : "w-6 h-6")} />
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};
