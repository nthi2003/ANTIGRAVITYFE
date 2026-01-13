import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex justify-center">
            <div className="w-full max-w-md bg-white h-screen relative shadow-2xl flex flex-col">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Fixed Header */}
                <div className="shrink-0">
                    <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 px-5 overflow-y-auto no-scrollbar">
                    <Outlet />
                </main>

                {/* Fixed Bottom Navigation */}
                <div className="shrink-0">
                    <BottomNav />
                </div>
            </div>
        </div>
    );
};
