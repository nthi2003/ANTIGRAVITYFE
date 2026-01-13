import axios from 'axios';
import type {
    FinancialHealthScore,
    NetWorthData,
    LiquidityData,
    BudgetRuleData,
    DebtData,
    FinancialFreedomData
} from '../types/financialHealth';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const financialHealthService = {
    /**
     * Get comprehensive financial health score
     */
    getHealthScore: async (): Promise<FinancialHealthScore> => {
        const response = await apiClient.get<FinancialHealthScore>('/financial-health/score');
        return response.data;
    },

    /**
     * Get net worth details
     */
    getNetWorth: async (): Promise<NetWorthData> => {
        const response = await apiClient.get<NetWorthData>('/financial-health/net-worth');
        return response.data;
    },

    /**
     * Get liquidity ratio
     */
    getLiquidity: async (): Promise<LiquidityData> => {
        const response = await apiClient.get<LiquidityData>('/financial-health/liquidity');
        return response.data;
    },

    /**
     * Get 50/30/20 budget analysis
     */
    getBudgetRule: async (): Promise<BudgetRuleData> => {
        const response = await apiClient.get<BudgetRuleData>('/financial-health/budget-rule');
        return response.data;
    },

    /**
     * Get debt-to-income ratio
     */
    getDebtRatio: async (): Promise<DebtData> => {
        const response = await apiClient.get<DebtData>('/financial-health/debt-ratio');
        return response.data;
    },

    /**
     * Get financial freedom calculator
     */
    getFinancialFreedom: async (): Promise<FinancialFreedomData> => {
        const response = await apiClient.get<FinancialFreedomData>('/financial-health/fi-calculator');
        return response.data;
    },

    /**
     * Get comprehensive monthly report
     */
    getMonthlyReport: async (): Promise<FinancialHealthScore> => {
        const response = await apiClient.get<FinancialHealthScore>('/financial-health/report');
        return response.data;
    },
};
