import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Tag, ChevronDown, CheckCircle2, Wallet, ArrowUpCircle, ArrowDownCircle, Camera, Repeat, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { transactionService } from './transactionService';
import { accountService, type Account } from '../accounts/accountService';
import { toast } from 'sonner';

export const TransactionEntryPage = () => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);

    useEffect(() => {
        accountService.getMyAccounts()
            .then(data => {
                setAccounts(data);
                if (data.length > 0) setSelectedAccountId(data[0].id);
            })
            .catch(err => console.error("Failed to load accounts", err));
    }, []);

    const handleQuickAmount = (val: number) => {
        setAmount(val.toLocaleString('vi-VN'));
    };

    const handleScan = () => {
        setIsScanning(true);
        // Simulate OCR API call
        setTimeout(() => {
            setAmount('155000');
            setCategory('Food');
            setIsScanning(false);
        }, 2000);
    };

    const handleSubmit = async () => {
        const rawAmount = parseFloat(amount.replace(/\./g, ''));
        if (!rawAmount || rawAmount <= 0 || !selectedAccountId) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await transactionService.recordTransaction({
                amount: rawAmount,
                category,
                type,
                accountId: selectedAccountId
            });
            setIsSuccess(true);
            setAmount('');
            toast.success(type === 'EXPENSE' ? "Đã ghi nhận chi tiêu!" : "Đã ghi nhận thu nhập!");
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to record transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="pt-2 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Nhập chi tiêu</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kỷ luật là tự do</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsRecurring(!isRecurring)}
                        className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border",
                            isRecurring ? "bg-primary/10 border-primary text-primary" : "bg-white border-slate-100 text-slate-400"
                        )}
                        title="Định kỳ"
                    >
                        <Repeat size={18} />
                    </button>
                    <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm active:scale-95"
                    >
                        {isScanning ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, scale: 0.9 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.9 }}
                        className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 mb-2 shadow-sm"
                    >
                        <CheckCircle2 size={24} className="shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-bold">Thành công!</p>
                            <p className="text-[10px] opacity-80 font-medium text-emerald-600">Số dư tài khoản và ngân sách đã được cập nhật.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-2 shadow-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Type Selector */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                <button
                    onClick={() => setType('EXPENSE')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
                        type === 'EXPENSE' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"
                    )}
                >
                    <ArrowDownCircle size={14} />
                    Chi tiêu
                </button>
                <button
                    onClick={() => setType('INCOME')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
                        type === 'INCOME' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
                    )}
                >
                    <ArrowUpCircle size={14} />
                    Thu nhập
                </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl shadow-slate-200/50">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] block mb-2">Số tiền (VND)</label>
                <div className="flex items-center gap-2 relative">
                    <span className={cn("text-3xl font-bold", type === 'EXPENSE' ? "text-rose-500" : "text-emerald-500")}>
                        ₫
                    </span>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setAmount(val ? parseInt(val).toLocaleString('vi-VN') : '');
                        }}
                        placeholder="0"
                        className="w-full text-4xl font-bold bg-transparent outline-none border-none p-0 placeholder:text-slate-200 text-slate-900"
                        autoFocus
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[50000, 100000, 200000].map(val => (
                    <button
                        key={val}
                        onClick={() => handleQuickAmount(val)}
                        className="bg-slate-50 border border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-3 rounded-2xl text-xs transition-all active:scale-95"
                    >
                        +{val / 1000}k
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {/* Account Selection */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Chọn tài khoản thanh toán</label>
                    <div className="relative">
                        <select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            className="w-full bg-white p-4 pr-10 rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-700 appearance-none outline-none focus:border-primary transition-colors text-sm"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} - ({acc.balance.toLocaleString()}đ)
                                </option>
                            ))}
                            {accounts.length === 0 && <option disabled>Chưa có tài khoản nào</option>}
                        </select>
                        <Wallet size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Hạng mục</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-700 appearance-none outline-none focus:border-primary transition-colors text-sm"
                        >
                            <option value="Food">Ăn uống</option>
                            <option value="Rent">Nhà cửa</option>
                            <option value="Transport">Di chuyển</option>
                            <option value="Shopping">Mua sắm</option>
                            <option value="Income">Lương / Thu nhập</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                </div>
            </div>

            <Button
                fullWidth
                size="lg"
                className={cn(
                    "mt-4 h-16 rounded-2xl text-lg shadow-xl shadow-primary/20 transition-all active:scale-95",
                    type === 'EXPENSE' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" : ""
                )}
                onClick={handleSubmit}
                isLoading={isSubmitting}
            >
                Xác nhận {type === 'EXPENSE' ? 'chi tiêu' : 'thu nhập'}
            </Button>
        </div>
    );
};
