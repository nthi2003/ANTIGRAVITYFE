import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, PieChart, CreditCard, Target, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { financialHealthService } from '../../services/financialHealthService';
import type { FinancialHealthScore } from '../../types/financialHealth';
import { getScoreColor, getRatingColor } from '../../types/financialHealth';
import { formatCurrency } from '../../utils/format';

export const FinancialHealthPage = () => {
    const [healthData, setHealthData] = useState<FinancialHealthScore | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadHealthData();
    }, []);

    const loadHealthData = async () => {
        try {
            setLoading(true);
            const data = await financialHealthService.getHealthScore();
            setHealthData(data);
            setError(null);
        } catch (err) {
            console.error('Failed to load financial health data', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !healthData) {
        return (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 text-sm font-bold">{error || 'Có lỗi xảy ra'}</p>
                <button
                    onClick={loadHealthData}
                    className="mt-3 text-xs font-bold text-red-700 underline"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const scoreColor = getScoreColor(healthData.overallScore);
    const scoreColorClass = {
        green: 'from-emerald-500 to-green-600',
        blue: 'from-blue-500 to-indigo-600',
        yellow: 'from-yellow-500 to-orange-500',
        orange: 'from-orange-500 to-red-500',
        red: 'from-red-500 to-rose-600',
    }[scoreColor];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <header className="pt-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sức Khỏe Tài Chính</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Đánh giá toàn diện dựa trên 5 chỉ số vàng
                </p>
            </header>

            {/* Overall Score Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`bg-gradient-to-br ${scoreColorClass} rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                            Điểm Tổng Hợp
                        </span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                        <h2 className="text-6xl font-black tracking-tighter">{healthData.overallScore}</h2>
                        <span className="text-2xl font-bold text-white/80">/100</span>
                    </div>

                    <p className="text-white/90 text-sm leading-relaxed">
                        {healthData.overallScore >= 80 && 'Xuất sắc! Tài chính của bạn rất khỏe mạnh.'}
                        {healthData.overallScore >= 60 && healthData.overallScore < 80 && 'Tốt! Bạn đang quản lý tài chính khá tốt.'}
                        {healthData.overallScore >= 40 && healthData.overallScore < 60 && 'Trung bình. Cần cải thiện một số chỉ số.'}
                        {healthData.overallScore < 40 && 'Cần chú ý! Hãy xem các khuyến nghị bên dưới.'}
                    </p>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Net Worth */}
                <MetricCard
                    icon={<TrendingUp size={20} />}
                    title="Tài Sản Ròng"
                    value={formatCurrency(healthData.netWorth.value)}
                    rating={healthData.netWorth.rating}
                    color={getRatingColor(healthData.netWorth.rating)}
                />

                {/* Liquidity */}
                <MetricCard
                    icon={<Shield size={20} />}
                    title="Dự Phòng"
                    value={`${healthData.liquidity.months.toFixed(1)} tháng`}
                    rating={healthData.liquidity.safetyLevel}
                    color={getRatingColor(healthData.liquidity.safetyLevel)}
                />

                {/* Budget Rule */}
                <MetricCard
                    icon={<PieChart size={20} />}
                    title="Ngân Sách"
                    value={`${healthData.budgetRule.savingsPercent.toFixed(0)}% tiết kiệm`}
                    rating={healthData.budgetRule.compliance}
                    color={getRatingColor(healthData.budgetRule.compliance)}
                />

                {/* Debt Ratio */}
                <MetricCard
                    icon={<CreditCard size={20} />}
                    title="Tỉ Lệ Nợ"
                    value={`${healthData.debt.ratio.toFixed(1)}%`}
                    rating={healthData.debt.riskLevel}
                    color={getRatingColor(healthData.debt.riskLevel)}
                />
            </div>

            {/* Financial Freedom */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                    <Target size={20} />
                    <h3 className="font-bold text-lg">Tự Do Tài Chính</h3>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-indigo-100">Tiến độ</span>
                        <span className="text-2xl font-black">{healthData.financialFreedom.progressPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, healthData.financialFreedom.progressPercent)}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-white rounded-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-indigo-100 text-xs mb-1">Mục tiêu</p>
                        <p className="font-bold">{formatCurrency(healthData.financialFreedom.targetAmount)}</p>
                    </div>
                    <div>
                        <p className="text-indigo-100 text-xs mb-1">Còn lại</p>
                        <p className="font-bold">{healthData.financialFreedom.yearsToFreedom.toFixed(1)} năm</p>
                    </div>
                </div>

                <p className="text-indigo-100 text-xs mt-4 leading-relaxed">
                    {healthData.financialFreedom.message}
                </p>
            </div>

            {/* Recommendations */}
            {healthData.recommendations && healthData.recommendations.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-primary" />
                        Khuyến Nghị Cho Bạn
                    </h3>
                    <div className="space-y-3">
                        {healthData.recommendations.map((rec, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-3 items-start"
                            >
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Metrics */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">
                    Chi Tiết Các Chỉ Số
                </h3>

                {/* Net Worth Detail */}
                <DetailCard
                    title="Tài Sản Ròng"
                    icon={<TrendingUp size={20} />}
                    color={getRatingColor(healthData.netWorth.rating)}
                >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 text-xs mb-1">Tổng tài sản</p>
                            <p className="font-bold text-slate-800">{formatCurrency(healthData.netWorth.totalAssets)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs mb-1">Tổng nợ</p>
                            <p className="font-bold text-rose-600">{formatCurrency(healthData.netWorth.totalLiabilities)}</p>
                        </div>
                    </div>
                </DetailCard>

                {/* Liquidity Detail */}
                <DetailCard
                    title="Quỹ Dự Phòng"
                    icon={<Shield size={20} />}
                    color={getRatingColor(healthData.liquidity.safetyLevel)}
                >
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                        {healthData.liquidity.message}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 text-xs mb-1">Tiền mặt</p>
                            <p className="font-bold text-slate-800">{formatCurrency(healthData.liquidity.liquidAssets)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs mb-1">Chi phí/tháng</p>
                            <p className="font-bold text-slate-800">{formatCurrency(healthData.liquidity.monthlyEssentialExpenses)}</p>
                        </div>
                    </div>
                </DetailCard>

                {/* Budget Rule Detail */}
                <DetailCard
                    title="Quy Tắc 50/30/20"
                    icon={<PieChart size={20} />}
                    color={getRatingColor(healthData.budgetRule.compliance)}
                >
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        {healthData.budgetRule.message}
                    </p>
                    <div className="space-y-3">
                        <BudgetBar
                            label="Thiết yếu"
                            percent={healthData.budgetRule.needsPercent}
                            amount={healthData.budgetRule.needsAmount}
                            target={50}
                            color="blue"
                        />
                        <BudgetBar
                            label="Sở thích"
                            percent={healthData.budgetRule.wantsPercent}
                            amount={healthData.budgetRule.wantsAmount}
                            target={30}
                            color="purple"
                        />
                        <BudgetBar
                            label="Tiết kiệm"
                            percent={healthData.budgetRule.savingsPercent}
                            amount={healthData.budgetRule.savingsAmount}
                            target={20}
                            color="green"
                        />
                    </div>
                </DetailCard>

                {/* Debt Detail */}
                <DetailCard
                    title="Tỉ Lệ Nợ / Thu Nhập"
                    icon={<CreditCard size={20} />}
                    color={getRatingColor(healthData.debt.riskLevel)}
                >
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                        {healthData.debt.message}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 text-xs mb-1">Thu nhập/tháng</p>
                            <p className="font-bold text-slate-800">{formatCurrency(healthData.debt.monthlyIncome)}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs mb-1">Trả nợ/tháng</p>
                            <p className="font-bold text-rose-600">{formatCurrency(healthData.debt.monthlyDebtPayments)}</p>
                        </div>
                    </div>
                </DetailCard>
            </div>
        </div>
    );
};

// Helper Components
interface MetricCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    rating: string;
    color: 'green' | 'blue' | 'yellow' | 'orange' | 'red';
}

const MetricCard = ({ icon, title, value, rating, color }: MetricCardProps) => {
    const colorClasses = {
        green: 'bg-emerald-50 border-emerald-100 text-emerald-600',
        blue: 'bg-blue-50 border-blue-100 text-blue-600',
        yellow: 'bg-yellow-50 border-yellow-100 text-yellow-600',
        orange: 'bg-orange-50 border-orange-100 text-orange-600',
        red: 'bg-rose-50 border-rose-100 text-rose-600',
    }[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm"
        >
            <div className={`w-10 h-10 rounded-2xl ${colorClasses} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-xl font-black text-slate-800 mb-1">{value}</p>
            <p className="text-[10px] font-bold text-slate-500">{rating}</p>
        </motion.div>
    );
};

interface DetailCardProps {
    title: string;
    icon: React.ReactNode;
    color: 'green' | 'blue' | 'yellow' | 'orange' | 'red';
    children: React.ReactNode;
}

const DetailCard = ({ title, icon, color, children }: DetailCardProps) => {
    const colorClasses = {
        green: 'text-emerald-600',
        blue: 'text-blue-600',
        yellow: 'text-yellow-600',
        orange: 'text-orange-600',
        red: 'text-rose-600',
    }[color];

    return (
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className={colorClasses}>{icon}</div>
                <h4 className="font-bold text-slate-800">{title}</h4>
            </div>
            {children}
        </div>
    );
};

interface BudgetBarProps {
    label: string;
    percent: number;
    amount: number;
    target: number;
    color: 'blue' | 'purple' | 'green';
}

const BudgetBar = ({ label, percent, amount, target, color }: BudgetBarProps) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-emerald-500',
    }[color];

    const isOverTarget = percent > target;

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-bold text-slate-600">{label}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-slate-800">{percent.toFixed(1)}%</span>
                    <span className="text-[10px] text-slate-400">/ {target}%</span>
                </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, percent)}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${isOverTarget ? 'bg-rose-500' : colorClasses} rounded-full`}
                />
            </div>
            <p className="text-[10px] text-slate-500">{formatCurrency(amount)}</p>
        </div>
    );
};
