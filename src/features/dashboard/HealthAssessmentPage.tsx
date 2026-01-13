import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ShieldCheck,
    PieChart,
    Lightbulb,
    ArrowRight,
    Target,
    Scale,
    Gem
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { healthService, type FinancialHealth } from './healthService';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

export const HealthAssessmentPage = () => {
    const [data, setData] = useState<FinancialHealth | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        healthService.getHealthScore()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 text-center mt-20">
                <p className="text-slate-500 font-bold">Không thể tải dữ liệu sức khỏe tài chính.</p>
                <NavLink to="/" className="text-primary font-bold mt-4 inline-block">Quay lại Dashboard</NavLink>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Header */}
            <header className="bg-white px-4 pt-6 pb-6 sticky top-0 z-10 shadow-sm border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <NavLink to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronLeft size={24} />
                    </NavLink>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Sức khỏe tài chính</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Overall Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Điểm số tổng quát</p>
                        <div className="relative">
                            <div className="text-6xl font-black tracking-tighter mb-2">{data.score}</div>
                            <div className="absolute -top-2 -right-6 text-sm font-bold text-slate-500">/100</div>
                        </div>
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mt-2",
                            data.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                data.score >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        )}>
                            {data.status}
                        </div>
                    </div>
                </motion.div>

                {/* 1. Net Worth Section */}
                <HealthSection
                    icon={<Gem className="text-indigo-500" />}
                    title="Giá trị ròng"
                    value={formatCurrency(data.netWorth.value)}
                    rating={data.netWorth.rating}
                >
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-50 p-3 rounded-2xl">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Tổng tài sản</p>
                            <p className="font-bold text-slate-700 text-sm">{formatCurrency(data.netWorth.totalAssets)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Tổng nợ</p>
                            <p className="font-bold text-rose-500 text-sm">{formatCurrency(data.netWorth.totalLiabilities)}</p>
                        </div>
                    </div>
                </HealthSection>

                {/* 2. Liquidity Section */}
                <HealthSection
                    icon={<ShieldCheck className="text-emerald-500" />}
                    title="Tính thanh khoản"
                    value={`${data.liquidity.months} tháng`}
                    rating={data.liquidity.safetyLevel}
                    desc={data.liquidity.message}
                >
                    <div className="mt-4 space-y-2">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((data.liquidity.months / 6) * 100, 100)}% ` }}
                                className={cn("h-full",
                                    data.liquidity.months >= 6 ? "bg-emerald-500" :
                                        data.liquidity.months >= 3 ? "bg-amber-500" : "bg-rose-500"
                                )}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold text-right italic">Mục tiêu an toàn: 6 tháng chi phí</p>
                    </div>
                </HealthSection>

                {/* 3. Budget Rule Section */}
                <HealthSection
                    icon={<PieChart className="text-purple-500" />}
                    title="Quy tắc 50/30/20"
                    value={data.budgetRule.compliance}
                    rating={data.budgetRule.compliance}
                    desc={data.budgetRule.message}
                >
                    <div className="space-y-4 mt-6">
                        <BudgetProgress label="Thiết yếu (50%)" percent={data.budgetRule.needsPercent} target={50} color="bg-indigo-500" />
                        <BudgetProgress label="Linh hoạt (30%)" percent={data.budgetRule.wantsPercent} target={30} color="bg-purple-500" />
                        <BudgetProgress label="Tiết kiệm & Nợ (20%)" percent={data.budgetRule.savingsPercent} target={20} color="bg-emerald-500" />
                    </div>
                </HealthSection>

                {/* 4. Debt Section */}
                <HealthSection
                    icon={<Scale className="text-rose-500" />}
                    title="Gánh nặng nợ (DTI)"
                    value={`${data.debt.ratio}% `}
                    rating={data.debt.riskLevel}
                    desc={data.debt.message}
                >
                    <div className="mt-4 p-4 bg-slate-900 rounded-2xl text-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-400">THU NHẬP</span>
                            <span className="text-sm font-bold text-emerald-400">{formatCurrency(data.debt.monthlyIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">TRẢ NỢ HÀNG THÁNG</span>
                            <span className="text-sm font-bold text-rose-400">{formatCurrency(data.debt.monthlyDebtPayments)}</span>
                        </div>
                    </div>
                </HealthSection>

                {/* 5. Financial Freedom Section */}
                <HealthSection
                    icon={<Target className="text-amber-500" />}
                    title="Tự do tài chính"
                    value={`${data.financialFreedom.progressPercent}% `}
                    rating={data.financialFreedom.progressPercent >= 10 ? 'GOOD' : 'FAIR'}
                    desc={data.financialFreedom.message}
                >
                    <div className="mt-6 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[24px] border border-white shadow-inner">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Mục tiêu FI</p>
                                <p className="text-xl font-black text-slate-800 tracking-tighter">{formatCurrency(data.financialFreedom.targetAmount)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">CÒN LẠI</p>
                                <p className="text-sm font-bold text-primary">{Math.max(0, data.financialFreedom.yearsToFreedom).toFixed(1)} năm</p>
                            </div>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden shadow-sm p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(data.financialFreedom.progressPercent, 100)}% ` }}
                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                            />
                        </div>
                    </div>
                </HealthSection>

                {/* Recommendations */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                            <Lightbulb size={20} />
                        </div>
                        <h3 className="font-black text-slate-800">Lời khuyên dành cho bạn</h3>
                    </div>
                    <div className="space-y-3">
                        {data.recommendations.map((rec, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-primary/20 transition-all group"
                            >
                                <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 text-primary mt-0.5">
                                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed">{rec}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HealthSection = ({
    icon,
    title,
    value,
    rating,
    desc,
    children
}: {
    icon: React.ReactNode,
    title: string,
    value: string,
    rating: string,
    desc?: string,
    children?: React.ReactNode
}) => {
    const getStatusStyle = (s: string) => {
        const status = s.toUpperCase();
        if (status.includes('EXCELLENT') || status.includes('VERY_SAFE') || status.includes('SAFE'))
            return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (status.includes('GOOD') || status.includes('SAFE'))
            return 'bg-blue-50 text-blue-600 border-blue-100';
        if (status.includes('FAIR') || status.includes('MODERATE') || status.includes('LOW'))
            return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-rose-50 text-rose-600 border-rose-100';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm border border-transparent">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</h3>
                        <p className="text-lg font-black text-slate-800 tracking-tight">{value}</p>
                    </div>
                </div>
                <div className={cn("px-3 py-1 rounded-xl text-[10px] font-bold border", getStatusStyle(rating))}>
                    {rating}
                </div>
            </div>
            {desc && <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">{desc}</p>}
            {children}
        </motion.div>
    );
};

const BudgetProgress = ({ label, percent, target, color }: { label: string, percent: number, target: number, color: string }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
            <div className="text-right">
                <span className="text-xs font-black text-slate-800">{percent}%</span>
                <span className="text-[10px] text-slate-400 ml-1">/ {target}%</span>
            </div>
        </div>
        <div className="h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-white">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}% ` }}
                className={cn("h-full rounded-full transition-all", color, percent > target + 5 ? "opacity-70" : "")}
            />
        </div>
    </div>
);
