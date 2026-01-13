import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Mail, Globe, LogOut, ShieldCheck, ChevronRight, Camera, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { userService, type User, type UserStats } from '../../services/userService';
import { toast } from 'sonner';

export const ProfilePage = () => {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            userService.getMe(),
            userService.getMyStats().catch(err => {
                console.error("Failed to load stats", err);
                return null;
            })
        ]).then(([userData, statsData]) => {
            setUser(userData);
            setStats(statsData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(nextLang);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updated = await userService.updateMe({
                fullName: user.fullName,
                email: user.email
            });
            setUser(updated);
            toast.success("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="pt-2 text-center pb-4">
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 p-1 shadow-2xl shadow-primary/20">
                        <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center overflow-hidden">
                            <span className="text-3xl font-black text-primary">
                                {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                            </span>
                        </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50 text-slate-400 hover:text-primary transition-colors">
                        <Camera size={16} />
                    </button>
                </div>
                <h1 className="text-xl font-bold text-slate-800 mt-4 tracking-tight">{user.fullName || user.username}</h1>
                <p className="text-xs text-slate-400 font-medium mb-4">@{user.username}</p>

                <div className="flex justify-center gap-6 mt-2">
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">{stats?.transactionCount || 0}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Giao dịch</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">{stats?.friendCount || 0}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Bạn bè</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">{stats?.goalCount || 0}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Mục tiêu</p>
                    </div>
                </div>
            </header>

            {/* Language Switch */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Settings</h3>

                <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                            <Globe size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-700">{t('language')}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                </button>

                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-700">Security / PIN</p>
                            <p className="text-[10px] text-slate-400 font-medium">Biometric enabled</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                </div>
            </div>

            {/* Profile Info Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{t('full_name')}</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={user.fullName}
                                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <UserIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{t('email')}</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                    </div>
                </div>

                <Button
                    fullWidth
                    className="mt-2 h-14 rounded-2xl shadow-lg shadow-primary/20"
                    onClick={handleSave}
                    isLoading={saving}
                >
                    {t('save_changes')}
                </Button>
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-5 rounded-3xl border border-rose-100 bg-rose-50/30 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all active:scale-[0.98]"
            >
                <LogOut size={18} />
                {t('logout')}
            </button>
        </div>
    );
};
