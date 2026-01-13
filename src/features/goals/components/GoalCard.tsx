import { motion } from 'framer-motion';
import { Lock, Users, ArrowRight, ShieldCheck, UserPlus, DollarSign, Plus } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { useState } from 'react';
import { AddMemberModal } from './AddMemberModal';
import { RequestWithdrawalModal } from './RequestWithdrawalModal';

import { ContributeModal } from './ContributeModal';
import { userService, type User as UserType } from '../../../services/userService';
import { useEffect } from 'react';
import { GoalDetailsModal } from './GoalDetailsModal';

interface MemberContribution {
    id: string;
    name: string;
    avatar: string;
    amount: number;
    target: number;
    role: string;
}

export const GoalCard = ({ id, title, current, target, members, isLocked, onRefresh }: {
    id: string;
    title: string;
    current: number;
    target: number;
    members: MemberContribution[];
    isLocked: boolean;
    onRefresh?: () => void;
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRequestWithdrawOpen, setIsRequestWithdrawOpen] = useState(false);
    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    useEffect(() => {
        userService.getMe().then(setCurrentUser).catch(console.error);
    }, []);

    const progress = (current / target) * 100;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            {isLocked && (
                <div className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-xl shadow-lg z-10">
                    <Lock size={16} className="animate-pulse" />
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{title}</h3>
                        <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">Quỹ tiết kiệm nhóm</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all"
                >
                    <UserPlus size={20} />
                </button>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{formatCurrency(current)}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mục tiêu: {formatCurrency(target)}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thành viên tham gia</p>
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {member.name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-600">{member.name}</span>
                                    <span className={cn(
                                        "text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight",
                                        member.role === 'OWNER' ? "bg-amber-100 text-amber-600" :
                                            member.role === 'MEMBER' ? "bg-blue-100 text-blue-600" :
                                                "bg-slate-100 text-slate-500"
                                    )}>
                                        {member.role === 'OWNER' ? 'Chủ nhóm' : member.role}
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-400">
                                    {member.target > 0 ? Math.round((member.amount / member.target) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                                    style={{ width: `${member.target > 0 ? Math.min((member.amount / member.target) * 100, 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Kỷ luật cao</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setIsContributeOpen(true)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                    >
                        Góp quỹ <Plus size={14} />
                    </button>
                    <button
                        onClick={() => setIsRequestWithdrawOpen(true)}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                    >
                        Rút quỹ <DollarSign size={14} />
                    </button>
                    <button
                        onClick={() => setIsDetailOpen(true)}
                        className="text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                    >
                        Chi tiết <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <AddMemberModal
                goalId={id}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => onRefresh && onRefresh()}
            />

            <RequestWithdrawalModal
                goalId={id}
                isOpen={isRequestWithdrawOpen}
                currentBalance={current}
                onClose={() => setIsRequestWithdrawOpen(false)}
                onSuccess={() => onRefresh && onRefresh()}
            />

            <ContributeModal
                goalId={id}
                isOpen={isContributeOpen}
                onClose={() => setIsContributeOpen(false)}
                onSuccess={() => onRefresh && onRefresh()}
            />

            <GoalDetailsModal
                goalId={id}
                currentUser={currentUser}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </div>
    );
};
