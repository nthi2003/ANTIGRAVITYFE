import { Menu, Search } from 'lucide-react';
import { NotificationCenter } from '../common/NotificationCenter';

interface HeaderProps {
    onOpenSidebar: () => void;
}

export const Header = ({ onOpenSidebar }: HeaderProps) => {
    return (
        <header className="relative flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
            <button
                onClick={onOpenSidebar}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
                <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                    <Search size={20} />
                </button>
                <NotificationCenter />
            </div>
        </header>
    );
};
