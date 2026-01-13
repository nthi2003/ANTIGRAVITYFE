import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Calendar, User, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/format';
import { Button } from '../../components/common/Button';

interface Debt {
    id: string;
    personName: string;
    amount: number;
    type: 'LEND' | 'BORROW';
    dueDate: string;
    interestRate: number;
    status: 'ACTIVE' | 'PAID';
    note: string;
}

export const DebtsPage = () => {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/debts')
            .then(setDebts)
            .finally(() => setLoading(false));
    }, []);

    const handlePay = (id: string) => {
        api.patch(`/debts/${id}/pay`)
            .then(() => {
                setDebts(prev => prev.map(d => d.id === id ? { ...d, status: 'PAID' } : d));
            });
    };

    const totalBorrowed = debts.filter(d => d.type === 'BORROW' && d.status === 'ACTIVE').reduce((sum, d) => sum + d.amount, 0);
    const totalLent = debts.filter(d => d.type === 'LEND' && d.status === 'ACTIVE').reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="pt-2 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Vay & Nợ</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Theo dõi các khoản vay trả</p>
                </div>
                <Button size="sm" className="rounded-2xl h-10 w-10 p-0 shadow-lg shadow-primary/20">
                    <Plus size={20} />
                </Button>
            </header>

            {/* Sumary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-rose-50 p-5 rounded-[32px] border border-rose-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <ArrowDownLeft size={48} />
                    </div>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Đang nợ</p>
                    <p className="text-lg font-black text-rose-700">{formatCurrency(totalBorrowed)}</p>
                </div>
                <div className="bg-emerald-50 p-5 rounded-[32px] border border-emerald-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <ArrowUpRight size={48} />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Cho vay</p>
                    <p className="text-lg font-black text-emerald-700">{formatCurrency(totalLent)}</p>
                </div>
            </div>

            {/* Debt List */}
            <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Giao dịch gần đây</h3>
                {debts.map((debt, i) => (
                    <motion.div
                        key={debt.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                            "bg-white p-5 rounded-[28px] border shadow-sm transition-all",
                            debt.status === 'PAID' ? "opacity-60 border-slate-100" : "border-slate-50 hover:border-primary/20"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner",
                                    debt.type === 'LEND' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                                )}>
                                    {debt.type === 'LEND' ? <ArrowUpRight /> : <ArrowDownLeft />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                        {debt.personName}
                                        {debt.status === 'PAID' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                            <Calendar size={12} />
                                            {new Date(debt.dueDate).toLocaleDateString()}
                                        </div>
                                        {debt.interestRate > 0 && (
                                            <div className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                                                Lãi {debt.interestRate}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={cn(
                                    "font-black text-sm",
                                    debt.type === 'LEND' ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {debt.type === 'LEND' ? '+' : '-'} {formatCurrency(debt.amount)}
                                </p>
                                {debt.status === 'ACTIVE' && (
                                    <button
                                        onClick={() => handlePay(debt.id)}
                                        className="mt-2 text-[10px] font-black text-primary hover:underline uppercase tracking-tighter"
                                    >
                                        Trả xong
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {debts.length === 0 && !loading && (
                <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
                        <User size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 font-bold text-sm">Chưa có vay nợ nào</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-1">Ghi lại các khoản nợ để luôn đúng hẹn và uy tín.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
