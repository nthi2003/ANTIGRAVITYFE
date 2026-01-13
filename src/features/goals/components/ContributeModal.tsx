import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { goalService } from '../goalService';
import { toast } from 'sonner';

interface ContributeModalProps {
    goalId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ContributeModal = ({ goalId, isOpen, onClose, onSuccess }: ContributeModalProps) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawAmount = parseFloat(amount.replace(/\./g, ''));
        if (!rawAmount || rawAmount <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        setLoading(true);
        try {
            await goalService.contribute(goalId, rawAmount);
            toast.success("Đã đóng góp vào quỹ chung thành công! 🎉");
            onSuccess();
            onClose();
            setAmount('');
        } catch (err: any) {
            toast.error(err.message || "Không thể thực hiện đóng góp");
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
                        className="relative z-[101] w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Đóng góp vào quỹ</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Góp gió thành bão</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số tiền đóng góp (VND)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setAmount(val ? parseInt(val).toLocaleString('vi-VN') : '');
                                        }}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                                        required
                                        autoFocus
                                    />
                                    <Wallet size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {[50000, 100000, 200000, 500000].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toLocaleString('vi-VN'))}
                                        className="py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-[10px] font-bold text-slate-500 transition-all border border-transparent hover:border-emerald-100"
                                    >
                                        + {val.toLocaleString('vi-VN')}
                                    </button>
                                ))}
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={loading}
                                className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200"
                            >
                                <Sparkles size={16} className="mr-2" />
                                Xác nhận đóng góp
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
