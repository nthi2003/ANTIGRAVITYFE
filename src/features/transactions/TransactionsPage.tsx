import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpCircle, ArrowDownCircle, Calendar, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { transactionService, type Transaction } from './transactionService';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import { NavLink } from 'react-router-dom';

export const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await transactionService.getRecentTransactions();
            setTransactions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const months = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const matchesType = filterType === 'ALL' || t.type === filterType;
        const matchesMonth = date.getMonth() === selectedMonth;
        const matchesYear = date.getFullYear() === selectedYear;
        const matchesSearch = t.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesMonth && matchesYear && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="pt-2 flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                    <NavLink to="/" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors">
                        <ChevronLeft size={20} />
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lịch sử</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Giao dịch của bạn</p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                    <SlidersHorizontal size={18} />
                </button>
            </header>

            {/* Date Selector */}
            <div className="flex items-center justify-between bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm mx-1">
                <button
                    onClick={() => {
                        if (selectedMonth === 0) {
                            setSelectedMonth(11);
                            setSelectedYear(v => v - 1);
                        } else {
                            setSelectedMonth(v => v - 1);
                        }
                    }}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <p className="text-sm font-black text-slate-800">{months[selectedMonth]}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{selectedYear}</p>
                </div>
                <button
                    onClick={() => {
                        if (selectedMonth === 11) {
                            setSelectedMonth(0);
                            setSelectedYear(v => v + 1);
                        } else {
                            setSelectedMonth(v => v + 1);
                        }
                    }}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 px-1">
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-[28px]">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <ArrowUpCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Thu nhập</span>
                    </div>
                    <p className="text-sm font-black text-emerald-700">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-[28px]">
                    <div className="flex items-center gap-2 text-rose-600 mb-1">
                        <ArrowDownCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Chi tiêu</span>
                    </div>
                    <p className="text-sm font-black text-rose-700">{formatCurrency(totalExpense)}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="space-y-4 px-1">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm hạng mục..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                    />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                    {(['ALL', 'INCOME', 'EXPENSE'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={cn(
                                "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filterType === t ? "bg-white text-primary shadow-sm" : "text-slate-400"
                            )}
                        >
                            {t === 'ALL' ? 'Tất cả' : t === 'INCOME' ? 'Thu' : 'Chi'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-3 px-1">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-50 h-20 rounded-[24px] animate-pulse" />
                        ))}
                    </div>
                ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white p-4 rounded-[24px] flex justify-between items-center shadow-sm border border-slate-50 hover:border-primary/20 transition-all group"
                        >
                            <div className="flex gap-4 items-center">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors",
                                    t.type === 'INCOME' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                                )}>
                                    {t.type === 'INCOME' ? '💰' : '💸'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{t.category}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                        {new Date(t.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={cn(
                                    "font-black text-sm tracking-tight",
                                    t.type === 'INCOME' ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
                            <Calendar size={32} />
                        </div>
                        <div>
                            <p className="text-slate-500 font-bold text-sm">Không có dữ liệu</p>
                            <p className="text-slate-400 text-[10px] font-medium mt-1">Thử thay đổi bộ lọc hoặc tháng xem sao!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
