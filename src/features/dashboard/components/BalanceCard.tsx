import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { formatCurrency } from '../../../utils/format';

export const BalanceCard = ({ amount, income, expense }: { amount: number, income: number, expense: number }) => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-500 font-medium text-sm">Total Balance</h3>
                <button onClick={() => setIsVisible(!isVisible)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50">
                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>

            <div className="mb-6 overflow-hidden">
                <span className={cn("text-3xl font-bold tracking-tight text-slate-900 transition-all duration-300 block truncate", !isVisible && "blur-md select-none")}>
                    {isVisible ? formatCurrency(amount) : "****** ₫"}
                </span>
            </div>

            <div className="flex gap-3">
                <div className="flex-1 bg-emerald-50/50 rounded-2xl p-3 flex items-center gap-3 border border-emerald-100 transition-transform active:scale-95">
                    <div className="bg-white p-2 rounded-xl text-emerald-500 shadow-sm"><TrendingUp size={18} strokeWidth={2.5} /></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Income</p>
                        <p className="text-sm font-bold text-slate-700">{isVisible ? `+ ${formatCurrency(income)}` : "***"}</p>
                    </div>
                </div>
                <div className="flex-1 bg-red-50/50 rounded-2xl p-3 flex items-center gap-3 border border-red-100 transition-transform active:scale-95">
                    <div className="bg-white p-2 rounded-xl text-red-500 shadow-sm"><TrendingDown size={18} strokeWidth={2.5} /></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expense</p>
                        <p className="text-sm font-bold text-slate-700">{isVisible ? `- ${formatCurrency(expense)}` : "***"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
