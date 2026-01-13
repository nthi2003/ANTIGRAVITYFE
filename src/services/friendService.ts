import axios from 'axios';
import type { Friend, FriendRequest, GoalInvitation, PrivacySettings } from '../types/friends';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const friendService = {
    getFriends: async (): Promise<Friend[]> => {
        const { data } = await apiClient.get<Friend[]>('/friends');
        return data;
    },

    searchFriends: async (query: string): Promise<Friend[]> => {
        const { data } = await apiClient.get<Friend[]>(`/friends/search?q=${query}`);
        return data;
    },

    sendFriendRequest: async (userId: string): Promise<void> => {
        await apiClient.post(`/friends/request/${userId}`);
    },

    getPendingRequests: async (): Promise<FriendRequest[]> => {
        const { data } = await apiClient.get<FriendRequest[]>('/friends/requests/pending');
        return data;
    },

    acceptRequest: async (friendshipId: string): Promise<void> => {
        await apiClient.post(`/friends/requests/${friendshipId}/accept`);
    },

    rejectRequest: async (friendshipId: string): Promise<void> => {
        await apiClient.post(`/friends/requests/${friendshipId}/reject`);
    },

    removeFriend: async (friendId: string): Promise<void> => {
        await apiClient.delete(`/friends/${friendId}`);
    },

    blockUser: async (userId: string): Promise<void> => {
        await apiClient.post(`/friends/block/${userId}`);
    },

    inviteToGoal: async (goalId: string, friendId: string, role: string, message?: string): Promise<void> => {
        await apiClient.post(`/goals/${goalId}/invite`, { userId: friendId, role, message });
    },

    getPendingInvitations: async (): Promise<GoalInvitation[]> => {
        const { data } = await apiClient.get<GoalInvitation[]>('/goals/invitations/pending');
        return data;
    },

    acceptInvitation: async (invitationId: string): Promise<void> => {
        await apiClient.post(`/goals/invitations/${invitationId}/accept`);
    },

    declineInvitation: async (invitationId: string): Promise<void> => {
        await apiClient.post(`/goals/invitations/${invitationId}/decline`);
    },

    getPrivacySettings: async (): Promise<PrivacySettings> => {
        const { data } = await apiClient.get<PrivacySettings>('/privacy');
        return data;
    },

    updatePrivacySettings: async (settings: PrivacySettings): Promise<void> => {
        await apiClient.put('/privacy', settings);
    },
};
