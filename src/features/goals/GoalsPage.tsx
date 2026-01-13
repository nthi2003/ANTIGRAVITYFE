import { useEffect, useState } from 'react';
import { GoalCard } from './components/GoalCard';
import { CreateGoalModal } from './components/CreateGoalModal';
import { Plus, Info, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { goalService, type Goal } from './goalService';

export const GoalsPage = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchGoals = () => {
        setLoading(true);
        goalService.getUserGoals()
            .then(data => {
                setGoals(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-center pt-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Về đích cùng nhau</h1>
                    <p className="text-xs text-slate-400 font-medium">Quản lý kỷ luật và tiết kiệm nhóm</p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus size={20} />
                </Button>
            </header>

            <div className="bg-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2">
                    <Info size={80} />
                </div>
                <h3 className="font-bold text-lg mb-1 relative z-10">Luật chơi kỷ luật</h3>
                <p className="text-indigo-100 text-xs leading-relaxed opacity-90 relative z-10">
                    Tiền đã vào quỹ sẽ bị khóa cho đến khi đạt mục tiêu hoặc 100% thành viên đồng ý mở khóa.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {goals.length > 0 ? (
                        goals.map(goal => (
                            <GoalCard
                                key={goal.id}
                                id={goal.id}
                                title={goal.title}
                                current={goal.currentAmount}
                                target={goal.targetAmount}
                                isLocked={goal.isLocked}
                                onRefresh={fetchGoals}
                                members={goal.members.map(m => ({
                                    id: m.userId,
                                    name: m.userName,
                                    amount: m.contributedAmount,
                                    target: m.targetAmount,
                                    role: m.role,
                                    avatar: ''
                                }))}
                            />
                        ))
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
                                <Plus size={40} className="text-slate-300" />
                            </div>
                            <div>
                                <h4 className="text-slate-600 font-bold text-lg">Chưa có quỹ chung nào</h4>
                                <p className="text-slate-400 text-xs font-medium mt-2 max-w-[240px]">
                                    Hãy tạo quỹ chung đầu tiên để bắt đầu kỷ luật tiết kiệm cùng bạn bè và người thân!
                                </p>
                            </div>
                            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} className="mt-2 px-8 rounded-2xl">
                                Tạo quỹ ngay
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <CreateGoalModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchGoals}
            />
        </div>
    );
};
