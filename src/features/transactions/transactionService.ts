import { api } from '../../utils/api';

export interface TransactionRequest {
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';
    accountId: string;
}

export interface Transaction {
    id: string;
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';
    date: string;
}

export const transactionService = {
    recordTransaction: (data: TransactionRequest): Promise<string> =>
        api.post('/transactions', data),
    getRecentTransactions: (): Promise<Transaction[]> =>
        api.get('/transactions'),
};
