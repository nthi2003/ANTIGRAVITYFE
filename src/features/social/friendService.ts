import { api } from '../../utils/api';

export interface FriendProfile {
    userId: string;
    username: string;
    fullName: string;
    avatar?: string;
    email: string;
    friendshipStatus: 'PENDING' | 'ACCEPTED' | 'BLOCKED' | 'NONE';
    mutualFriendsCount: number;
    sharedGoalsCount: number;
    isOnline: boolean;
    rankTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
}

export const friendService = {
    getFriends: (): Promise<FriendProfile[]> => api.get('/friends'),
    getPendingRequests: (): Promise<FriendProfile[]> => api.get('/friends/requests'),
    searchFriends: (query: string): Promise<FriendProfile[]> => api.get(`/friends/search?query=${encodeURIComponent(query)}`),
    discoverUsers: (): Promise<FriendProfile[]> => api.get('/friends/discover'),
    sendRequest: (friendId: string) => api.post(`/friends/request/${friendId}`, {}),
    acceptRequest: (friendshipId: string) => api.put(`/friends/request/${friendshipId}/accept`),
    rejectRequest: (friendshipId: string) => api.delete(`/friends/request/${friendshipId}/reject`),
    removeFriend: (friendId: string) => api.delete(`/friends/${friendId}`),
};
