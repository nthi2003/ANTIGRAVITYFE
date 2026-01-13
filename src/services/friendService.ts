import { api } from '../utils/api';
import type { Friend, FriendRequest, GoalInvitation, PrivacySettings } from '../types/friends';

export const friendService = {
    getFriends: async (): Promise<Friend[]> => {
        return await api.get('/friends');
    },

    searchFriends: async (query: string): Promise<Friend[]> => {
        return await api.get(`/friends/search?q=${encodeURIComponent(query)}`);
    },

    sendFriendRequest: async (userId: string): Promise<void> => {
        await api.post(`/friends/request/${userId}`, {});
    },

    getPendingRequests: async (): Promise<FriendRequest[]> => {
        return await api.get('/friends/requests/pending');
    },

    acceptRequest: async (friendshipId: string): Promise<void> => {
        await api.post(`/friends/requests/${friendshipId}/accept`, {});
    },

    rejectRequest: async (friendshipId: string): Promise<void> => {
        await api.post(`/friends/requests/${friendshipId}/reject`, {});
    },

    removeFriend: async (friendId: string): Promise<void> => {
        await api.delete(`/friends/${friendId}`);
    },

    blockUser: async (userId: string): Promise<void> => {
        await api.post(`/friends/block/${userId}`, {});
    },

    inviteToGoal: async (goalId: string, friendId: string, role: string, message?: string): Promise<void> => {
        await api.post(`/goals/${goalId}/invite`, { userId: friendId, role, message });
    },

    getPendingInvitations: async (): Promise<GoalInvitation[]> => {
        return await api.get('/goals/invitations/pending');
    },

    acceptInvitation: async (invitationId: string): Promise<void> => {
        await api.post(`/goals/invitations/${invitationId}/accept`, {});
    },

    declineInvitation: async (invitationId: string): Promise<void> => {
        await api.post(`/goals/invitations/${invitationId}/decline`, {});
    },

    getPrivacySettings: async (): Promise<PrivacySettings> => {
        return await api.get('/privacy');
    },

    updatePrivacySettings: async (settings: PrivacySettings): Promise<void> => {
        await api.put('/privacy', settings);
    },
};
