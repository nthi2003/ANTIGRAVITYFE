import { HealthScoreCard } from './components/HealthScoreCard';
import { BalanceCard } from './components/BalanceCard';
import { PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { healthService, type FinancialHealth } from './healthService';
import { useTranslation } from 'react-i18next';
import { userService, type User } from '../../services/userService';
import { transactionService, type Transaction } from '../transactions/transactionService';
import { formatCurrency } from '../../utils/format';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const DashboardPage = () => {
    const { t } = useTranslation();
    const [healthData, setHealthData] = useState<FinancialHealth | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            healthService.getHealthScore(),
            userService.getMe(),
            transactionService.getRecentTransactions()
        ])
            .then(([hData, userData, tData]) => {
                setHealthData(hData);
                setUser(userData);
                setTransactions(tData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Could not connect to backend. Please ensure the server is running.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                <p className="text-red-600 text-sm font-bold">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-xs font-bold text-red-700 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="flex justify-between items-center pt-2 px-1">
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('good_morning')}</h2>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">{user?.fullName || 'User'}</h1>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 p-0.5 shadow-lg shadow-primary/20">
                    <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-black text-primary">
                            {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </span>
                    </div>
                </div>
            </header>

            <HealthScoreCard score={healthData?.score || 0} />
            <BalanceCard
                amount={healthData?.totalBalance || 0}
                income={healthData?.monthlyIncome || 0}
                expense={healthData?.monthlyExpense || 0}
            />

            {/* Strict Limits Alert - Only show if at risk */}
            {healthData?.isAtRisk && (
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 flex gap-4 items-start shadow-sm animate-pulse">
                    <div className="bg-white p-2.5 rounded-2xl text-rose-500 shadow-sm shrink-0 border border-rose-50">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h4 className="text-rose-900 font-bold text-sm">Cảnh báo kỷ luật</h4>
                        <p className="text-rose-700 text-xs mt-1 leading-relaxed font-medium">
                            Bạn đang chi tiêu vượt mức ở một số hạng mục. Hãy kiểm tra lại ngân sách ngay!
                        </p>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="px-1">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">{t('recent_activity')}</h3>
                    <NavLink to="/transactions" className="text-xs font-bold text-primary hover:underline">Xem tất cả</NavLink>
                </div>

                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <div key={transaction.id} className="bg-white p-4 rounded-[24px] flex justify-between items-center shadow-sm border border-slate-50 hover:border-primary/20 transition-all">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-inner">
                                        {transaction.type === 'INCOME' ? '💰' : '💸'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{transaction.category}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "font-black text-sm",
                                    transaction.type === 'INCOME' ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[32px] p-10 flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
                                <PlusCircle size={32} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-sm">Chưa có giao dịch nào</p>
                                <p className="text-slate-400 text-[10px] font-medium mt-1">Bắt đầu ghi lại chi tiêu ngay để quản lý tài chính tốt hơn!</p>
                            </div>
                            <NavLink to="/add" className="mt-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-primary/30 active:scale-95 transition-all">
                                Nhập chi tiêu ngay
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
