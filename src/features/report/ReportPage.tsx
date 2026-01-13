import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

export const ReportPage = () => {
    const data = [
        { month: 'Jan', income: 45, expense: 30 },
        { month: 'Feb', income: 52, expense: 35 },
        { month: 'Mar', income: 48, expense: 42 },
        { month: 'Apr', income: 61, expense: 38 },
        { month: 'May', income: 55, expense: 40 },
        { month: 'Jun', income: 68, expense: 32 },
    ];

    const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="pt-2">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Analysis</h1>
                <p className="text-xs text-slate-400 font-medium">AI-powered insights for your growth</p>
            </header>

            {/* AI Suggestion Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={100} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                        <Sparkles size={16} className="text-amber-300" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">AI Insight</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Save up to 15% more</h3>
                <p className="text-indigo-100 text-xs leading-relaxed opacity-90">
                    Your "Dining Out" expense has increased by 12% this month. Switching to home cooking on weekdays could add <span className="font-bold text-white">2.5M ₫</span> to your Travel Fund by August.
                </p>
                <button className="mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all border border-white/10">
                    Set Auto-Rule
                </button>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-slate-800">Income vs Expense</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">In</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Out</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between h-48 gap-2">
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex justify-center items-end gap-1 h-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.income / maxVal) * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full max-w-[12px] bg-indigo-500 rounded-t-full"
                                />
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.expense / maxVal) * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                                    className="w-full max-w-[12px] bg-slate-200 rounded-t-full"
                                />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{d.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <TrendingUp className="text-emerald-500 mb-2" size={20} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Savings Rate</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">32.5%</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">+2.1% ↑</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <Target className="text-indigo-500 mb-2" size={20} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goal Efficiency</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">94%</p>
                    <p className="text-[10px] text-indigo-600 font-bold mt-1">On Track</p>
                </div>
            </div>
        </div>
    );
};
