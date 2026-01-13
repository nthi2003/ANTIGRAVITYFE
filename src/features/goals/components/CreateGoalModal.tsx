import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { goalService } from '../goalService';
import { toast } from 'sonner';

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateGoalModal = ({ isOpen, onClose, onSuccess }: CreateGoalModalProps) => {
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawAmount = parseFloat(targetAmount.replace(/\./g, ''));
        if (!title || !rawAmount || rawAmount <= 0) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);
        try {
            await goalService.createGoal({
                title,
                targetAmount: rawAmount
            });
            toast.success("Đã tạo quỹ chung mới thành công!");
            onSuccess();
            onClose();
            setTitle('');
            setTargetAmount('');
        } catch (err: any) {
            toast.error(err.message || "Không thể tạo quỹ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative z-[101] w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-primary/5 to-indigo-500/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Tạo quỹ chung mới</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thiết lập mục tiêu nhóm</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên mục tiêu / Quỹ chung</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ví dụ: Du lịch Hàn Quốc, Tiết kiệm mua nhà..."
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                        required
                                    />
                                    <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số tiền mục tiêu (VND)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={targetAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setTargetAmount(val ? parseInt(val).toLocaleString('vi-VN') : '');
                                        }}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                        required
                                    />
                                    <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                                    <Sparkles size={12} /> Gợi ý kỷ luật:
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    Sau khi tạo, bạn có thể mời bạn bè/người thân cùng tham gia và thiết lập hạn mức đóng góp cho mỗi người.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={loading}
                                className="h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200"
                            >
                                Bắt đầu tiết kiệm ngay
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
