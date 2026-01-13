import { api } from '../../utils/api';

export interface FinancialHealth {
    score: number;
    status: string;
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    isAtRisk: boolean;
    netWorth: {
        value: number;
        totalAssets: number;
        totalLiabilities: number;
        rating: string;
        trend: string;
    };
    liquidity: {
        liquidAssets: number;
        monthlyEssentialExpenses: number;
        months: number;
        safetyLevel: string;
        message: string;
    };
    budgetRule: {
        needsAmount: number;
        needsPercent: number;
        wantsAmount: number;
        wantsPercent: number;
        savingsAmount: number;
        savingsPercent: number;
        compliance: string;
        message: string;
    };
    debt: {
        monthlyIncome: number;
        monthlyDebtPayments: number;
        ratio: number;
        riskLevel: string;
        message: string;
    };
    financialFreedom: {
        monthlyExpenses: number;
        annualExpenses: number;
        targetAmount: number;
        currentAmount: number;
        progressPercent: number;
        yearsToFreedom: number;
        message: string;
    };
    recommendations: string[];
}

export const healthService = {
    getHealthScore: (): Promise<FinancialHealth> => api.get('/financial-health'),
};
