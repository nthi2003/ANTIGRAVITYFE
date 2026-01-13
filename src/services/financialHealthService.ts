import { api } from '../utils/api';
import type {
    FinancialHealthScore,
    NetWorthData,
    LiquidityData,
    BudgetRuleData,
    DebtData,
    FinancialFreedomData
} from '../types/financialHealth';

export const financialHealthService = {
    /**
     * Get comprehensive financial health score
     */
    getHealthScore: async (): Promise<FinancialHealthScore> => {
        return await api.get('/financial-health');
    },

    /**
     * Get net worth details
     */
    getNetWorth: async (): Promise<NetWorthData> => {
        return await api.get('/financial-health/net-worth');
    },

    /**
     * Get liquidity ratio
     */
    getLiquidity: async (): Promise<LiquidityData> => {
        return await api.get('/financial-health/liquidity');
    },

    /**
     * Get 50/30/20 budget analysis
     */
    getBudgetRule: async (): Promise<BudgetRuleData> => {
        return await api.get('/financial-health/budget-rule');
    },

    /**
     * Get debt-to-income ratio
     */
    getDebtRatio: async (): Promise<DebtData> => {
        return await api.get('/financial-health/debt-ratio');
    },

    /**
     * Get financial freedom calculator
     */
    getFinancialFreedom: async (): Promise<FinancialFreedomData> => {
        return await api.get('/financial-health/fi-calculator');
    },

    /**
     * Get comprehensive monthly report
     */
    getMonthlyReport: async (): Promise<FinancialHealthScore> => {
        return await api.get('/financial-health/report');
    },
};
