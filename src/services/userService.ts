import { api } from '../utils/api';

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
}

export const userService = {
    getMe: async (): Promise<User> => {
        return await api.get('/users/me');
    },

    updateMe: async (data: Partial<User>): Promise<User> => {
        return await api.put('/users/me', data);
    },

    searchUsers: async (query: string): Promise<User[]> => {
        return await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    },

    getMyStats: async (): Promise<UserStats> => {
        return await api.get('/users/me/stats');
    }
};

export interface UserStats {
    transactionCount: number;
    friendCount: number;
    goalCount: number;
}
