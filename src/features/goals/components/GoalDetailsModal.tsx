import { X, FileText } from 'lucide-react';
import { WithdrawalRequestsList } from './WithdrawalRequestsList';
import type { User } from '../../../services/userService';
import { useEffect } from 'react';

interface GoalDetailsModalProps {
    goalId: string;
    currentUser: User | null;
    isOpen: boolean;
    onClose: () => void;
}

export const GoalDetailsModal = ({ goalId, currentUser, isOpen, onClose }: GoalDetailsModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200 shadow-2xl">
                <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Chi tiết quỹ</h2>
                            <p className="text-xs text-slate-400 font-bold">Quản lý yêu cầu & lịch sử</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        Danh sách duyệt đơn <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px]">Pending</span>
                    </h3>
                    <WithdrawalRequestsList goalId={goalId} currentUser={currentUser} />

                    {/* Placeholder for future details like transaction history */}
                </div>
            </div>
        </div>
    );
};
