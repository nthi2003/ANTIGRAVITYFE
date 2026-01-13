import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const HealthScoreCard = ({ score }: { score: number }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <NavLink to="/health-assessment" className="block active:scale-[0.98] transition-all">
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-6 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden border border-slate-800 group">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px] rounded-full -mr-10 -mt-10" />

                <div className="flex items-center justify-between">
                    <div className="z-10">
                        <h3 className="text-slate-400 font-medium text-sm tracking-wide uppercase">Health Score</h3>
                        <div className="mt-1">
                            <span className="text-4xl font-bold tracking-tight">{score}</span>
                            <span className="text-slate-500 ml-1 text-sm font-medium">/ 100</span>
                        </div>
                        <p className={cn("text-xs font-medium mt-2 py-1 px-3 rounded-full inline-block backdrop-blur-md bg-white/5 border border-white/5",
                            score >= 80 ? "text-emerald-400 border-emerald-500/30" :
                                score >= 50 ? "text-amber-400 border-amber-500/30" : "text-red-400 border-red-500/30"
                        )}>
                            {score >= 80 ? "Excellent" : score >= 50 ? "Needs Attention" : "Critical"}
                        </p>
                    </div>

                    {/* Circular Gauge */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-800"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={cn(
                                    "scale-100 origin-center transition-colors duration-500",
                                    score >= 80 ? "text-emerald-500" :
                                        score >= 50 ? "text-amber-500" : "text-red-500"
                                )}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center shadow-inner">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all">
                    <ChevronRight size={20} />
                </div>
            </div>
        </NavLink>
    );
};
