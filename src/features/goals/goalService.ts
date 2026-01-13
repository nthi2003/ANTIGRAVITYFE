import { api } from '../../utils/api';

export interface GoalMember {
    userId: string;
    userName: string;
    contributedAmount: number;
    targetAmount: number;
    role: 'OWNER' | 'MEMBER' | 'VIEWER';
}

export interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    isLocked: boolean;
    members: GoalMember[];
}

export interface GoalRequest {
    title: string;
    targetAmount: number;
}

export interface MemberRequest {
    username: string;
    targetAmount: number;
    role: string;
}

export interface Settlement {
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
}

export interface WithdrawalApproval {
    userId: string;
    userName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    updatedAt: string;
}

export interface WithdrawalRequest {
    id: string;
    goalId: string;
    requesterId: string;
    requesterName: string;
    amount: number;
    description: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    approvals: WithdrawalApproval[];
}

export const goalService = {
    getUserGoals: (): Promise<Goal[]> => api.get('/goals'),
    createGoal: (data: GoalRequest): Promise<Goal> => api.post('/goals', data),
    addMember: (goalId: string, data: MemberRequest): Promise<string> => api.post(`/goals/${goalId}/members`, data),
    getSettlements: (goalId: string): Promise<Settlement[]> => api.get(`/goals/${goalId}/settlements`),
    contribute: (goalId: string, amount: number): Promise<string> => api.post(`/goals/${goalId}/contribute`, amount),

    // Joint Fund Withdrawals
    requestWithdrawal: (goalId: string, data: { amount: number; description: string }): Promise<string> =>
        api.post(`/goals/${goalId}/withdrawals`, data),
    getWithdrawals: (goalId: string): Promise<WithdrawalRequest[]> =>
        api.get(`/goals/${goalId}/withdrawals`),
    approveWithdrawal: (requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<string> =>
        api.post(`/goals/withdrawals/${requestId}/approve`, { status }),
};
