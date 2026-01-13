import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, DollarSign, FileText } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { goalService } from '../goalService';
import { toast } from 'sonner';

interface RequestWithdrawalModalProps {
    goalId: string;
    isOpen: boolean;
    currentBalance: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const RequestWithdrawalModal = ({ goalId, isOpen, currentBalance, onClose, onSuccess }: RequestWithdrawalModalProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawAmount = parseFloat(amount.replace(/\./g, ''));
        if (!rawAmount || rawAmount <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        if (rawAmount > currentBalance) {
            toast.error(`Số dư quỹ không đủ (Hiện tại: ${currentBalance.toLocaleString('vi-VN')}đ)`);
            return;
        }

        setLoading(true);
        try {
            await goalService.requestWithdrawal(goalId, { amount: rawAmount, description });
            toast.success("Đã gửi yêu cầu rút tiền. Đang chờ các thành viên phê duyệt.");
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Không thể gửi yêu cầu");
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
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Yêu cầu rút quỹ</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cần tất cả phê duyệt</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 text-amber-700">
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">
                                    Tiền sẽ chỉ được rút sau khi TOÀN BỘ thành viên trong nhóm nhấn nút phê duyệt.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                    <span>Số tiền muốn rút (VND)</span>
                                    <span className="text-primary tracking-tight">Số dư: {currentBalance.toLocaleString('vi-VN')}đ</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setAmount(val ? parseInt(val).toLocaleString('vi-VN') : '');
                                        }}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                                        required
                                    />
                                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lý do rút tiền</label>
                                <div className="relative">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ghi chú lý do chi tiêu..."
                                        rows={3}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner resize-none"
                                        required
                                    />
                                    <FileText size={18} className="absolute left-4 top-4 text-slate-300" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={loading}
                                className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                            >
                                <Send size={18} className="mr-2" />
                                Gửi yêu cầu phê duyệt
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
