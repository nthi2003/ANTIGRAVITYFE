import { api } from '../../utils/api';

export interface Account {
    id: string;
    name: string;
    type: 'CASH' | 'BANK' | 'CREDIT' | 'E_WALLET' | 'INVESTMENT';
    balance: number;
    currency: string;
    creditLimit?: number;
    userId: string;
}

export interface AccountRequest {
    name: string;
    type: string;
    balance: number;
    currency: string;
    creditLimit?: number;
}

export const accountService = {
    getMyAccounts: (): Promise<Account[]> => api.get('/accounts'),
    createAccount: (data: AccountRequest): Promise<Account> => api.post('/accounts', data),
    updateAccount: (id: string, data: AccountRequest): Promise<Account> => api.put(`/accounts/${id}`, data),
    deleteAccount: (id: string): Promise<void> => api.delete(`/accounts/${id}`),
};
