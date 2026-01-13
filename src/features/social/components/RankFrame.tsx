import { useMemo } from 'react';
import { cn } from '../../../utils/cn';

interface RankFrameProps {
    rank?: number; // 1, 2, 3, or other
    tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
    imageSrc?: string;
    alt?: string;
    size?: number;
    className?: string;
}

export const RankFrame = ({ rank = 0, tier, imageSrc, alt, size = 64, className }: RankFrameProps) => {
    // Config cho 4 cấp độ khung
    const config = useMemo(() => {
        // Map Tier to Rank logical equivalent for styling
        let effectiveRank = rank;
        if (tier === 'DIAMOND') effectiveRank = 1; // Diamond style (reuse Rank 1 or creates new)
        else if (tier === 'PLATINUM') effectiveRank = 2; // Platinum style
        else if (tier === 'GOLD') effectiveRank = 1;
        else if (tier === 'SILVER') effectiveRank = 2;
        else if (tier === 'BRONZE') effectiveRank = 3;

        // Custom Overrides for High Tiers if needed, otherwise fallback to existing 1-2-3 styles
        if (tier === 'DIAMOND') {
            return {
                gradientId: "grad-diamond",
                colors: { start: "#b9fbc0", mid: "#43cea2", end: "#185a9d" }, // Diamond/Blueish
                glowColor: "rgba(67, 206, 162, 0.6)",
                icon: "💎",
                iconClass: "text-2xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] -mt-4 animate-pulse",
                framePath: "M50 2 L58 15 L70 15 L62 25 L68 38 L50 30 L32 38 L38 25 L30 15 L42 15 Z",
                ringWidth: 4
            };
        }
        if (tier === 'PLATINUM') {
            return {
                gradientId: "grad-platinum",
                colors: { start: "#e0eafc", mid: "#cfdef3", end: "#a8edea" }, // Platinum/Cyan
                glowColor: "rgba(168, 237, 234, 0.5)",
                icon: "💠",
                iconClass: "text-xl drop-shadow-sm -mt-3",
                ringWidth: 3
            };
        }


        if (effectiveRank === 1) {
            return {
                gradientId: "grad-rank-1",
                colors: { start: "#FFD700", mid: "#FDB931", end: "#FFF8DC" }, // Gold
                glowColor: "rgba(255, 215, 0, 0.5)",
                icon: tier ? "👑" : "👑",
                iconClass: "text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] -mt-4",
                framePath: "M50 2 L58 15 L70 15 L62 25 L68 38 L50 30 L32 38 L38 25 L30 15 L42 15 Z", // Crown shape hint
                ringWidth: 3
            };
        } else if (effectiveRank === 2) {
            return {
                gradientId: "grad-rank-2",
                colors: { start: "#E0E0E0", mid: "#C0C0C0", end: "#F5F5F5" }, // Silver
                glowColor: "rgba(192, 192, 192, 0.5)",
                icon: tier ? (tier === 'SILVER' ? "⚔️" : "⚔️") : "⚔️",
                iconClass: "text-xl drop-shadow-sm -mt-3",
                ringWidth: 3
            };
        } else if (effectiveRank === 3) {
            return {
                gradientId: "grad-rank-3",
                colors: { start: "#CD7F32", mid: "#A0522D", end: "#FFCC99" }, // Bronze
                glowColor: "rgba(205, 127, 50, 0.4)",
                icon: "🛡️",
                iconClass: "text-lg drop-shadow-sm -mt-3",
                ringWidth: 3
            };
        } else {
            // Top 4-10 or others
            return {
                gradientId: "grad-rank-4",
                colors: { start: "#64748b", mid: "#94a3b8", end: "#cbd5e1" }, // Slate/Blueish
                glowColor: "rgba(148, 163, 184, 0.2)",
                icon: null,
                iconClass: "",
                ringWidth: 2
            };
        }
    }, [rank, tier]);

    return (
        <div
            className={cn("relative flex items-center justify-center shrink-0", className)}
            style={{ width: size, height: size }}
        >
            {/* 1. Glow Effect Layer (Background) */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none"
                style={{ backgroundColor: rank <= 3 ? config.glowColor : 'transparent' }}
            />

            {/* 2. Avatar Layer (Masked Circle) - Nằm dưới khung */}
            <div className="absolute inset-[6%] rounded-full overflow-hidden border-2 border-white bg-slate-100 z-0 shadow-sm">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={alt || "Avatar"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 bg-slate-100 text-sm">
                        {alt?.charAt(0).toUpperCase() || "?"}
                    </div>
                )}
            </div>

            {/* 3. Frame Overlay Layer (SVG) - Nằm đè lên Avatar */}
            <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full z-10 drop-shadow-md pointer-events-none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id={config.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={config.colors.start} />
                        <stop offset="50%" stopColor={config.colors.mid} />
                        <stop offset="100%" stopColor={config.colors.end} />
                    </linearGradient>
                    <filter id={`glow-${rank}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Main Ring Frame */}
                <circle
                    cx="50" cy="50" r="47"
                    fill="none"
                    stroke={`url(#${config.gradientId})`}
                    strokeWidth={config.ringWidth}
                    strokeLinecap="round"
                    filter={rank === 1 ? `url(#glow-${rank})` : undefined}
                />

                {/* Decorative Elements for Top Ranks */}
                {rank === 1 && (
                    <g fill={`url(#${config.gradientId})`} filter={`url(#glow-${rank})`}>
                        {/* Wings/Leaves */}
                        <path d="M10 50 Q 5 20, 30 10 Q 20 30, 15 50" />
                        <path d="M90 50 Q 95 20, 70 10 Q 80 30, 85 50" />

                        {/* Bottom Decoration */}
                        <path d="M50 98 L40 90 Q 50 85, 60 90 Z" />
                    </g>
                )}

                {rank === 2 && (
                    <g stroke={`url(#${config.gradientId})`} strokeWidth="1.5" fill="none">
                        {/* Tech/Sharp lines */}
                        <path d="M50 2 L50 8 M50 92 L50 98" />
                        <path d="M2 50 L8 50 M92 50 L98 50" />
                        <circle cx="50" cy="50" r="42" strokeDasharray="10 5" strokeWidth="1" opacity="0.7" />
                    </g>
                )}

                {rank === 3 && (
                    <g fill={`url(#${config.gradientId})`}>
                        {/* Solid studs */}
                        <circle cx="50" cy="5" r="3" />
                        <circle cx="50" cy="95" r="3" />
                        <circle cx="5" cy="50" r="3" />
                        <circle cx="95" cy="50" r="3" />
                    </g>
                )}
            </svg>

            {/* 4. Rank Badge & Icon Layer (Highest Z-index) */}
            {rank <= 3 && (
                <>
                    {/* Top Icon (Crown, Sword, Shield) */}
                    <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 z-20 animate-bounce transition-all", config.iconClass)}>
                        {config.icon}
                    </div>

                    {/* Bottom Rank Number */}
                    <div
                        className="absolute -bottom-1 z-20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-sm bg-white"
                        style={{ borderColor: config.colors.mid, color: config.colors.mid }}
                    >
                        {rank}
                    </div>
                </>
            )}
            {rank > 3 && (
                <div className="absolute -bottom-1 z-20 bg-slate-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-slate-600">
                    #{rank}
                </div>
            )}
        </div>
    );
};
