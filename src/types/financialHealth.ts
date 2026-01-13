// Financial Health Types
export interface FinancialHealthScore {
    userId: string;
    calculatedAt: string;
    overallScore: number; // 0-100
    netWorth: NetWorthData;
    liquidity: LiquidityData;
    budgetRule: BudgetRuleData;
    debt: DebtData;
    financialFreedom: FinancialFreedomData;
    recommendations: string[];
}

export interface NetWorthData {
    value: number;
    totalAssets: number;
    totalLiabilities: number;
    rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface LiquidityData {
    liquidAssets: number;
    monthlyEssentialExpenses: number;
    months: number;
    safetyLevel: 'CRITICAL' | 'LOW' | 'SAFE' | 'VERY_SAFE' | 'EXCELLENT';
    message: string;
}

export interface BudgetRuleData {
    needsAmount: number;
    needsPercent: number;
    wantsAmount: number;
    wantsPercent: number;
    savingsAmount: number;
    savingsPercent: number;
    compliance: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    message: string;
}

export interface DebtData {
    monthlyIncome: number;
    monthlyDebtPayments: number;
    ratio: number;
    riskLevel: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    message: string;
}

export interface FinancialFreedomData {
    monthlyExpenses: number;
    annualExpenses: number;
    targetAmount: number;
    currentAmount: number;
    progressPercent: number;
    yearsToFreedom: number;
    message: string;
}

// Helper type for rating colors
export type RatingColor = 'green' | 'blue' | 'yellow' | 'orange' | 'red';

export const getRatingColor = (rating: string): RatingColor => {
    switch (rating) {
        case 'EXCELLENT':
            return 'green';
        case 'GOOD':
        case 'VERY_SAFE':
        case 'SAFE':
            return 'blue';
        case 'FAIR':
        case 'MODERATE':
            return 'yellow';
        case 'POOR':
        case 'LOW':
        case 'HIGH':
            return 'orange';
        case 'CRITICAL':
            return 'red';
        default:
            return 'blue';
    }
};

export const getScoreColor = (score: number): RatingColor => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'yellow';
    if (score >= 20) return 'orange';
    return 'red';
};
