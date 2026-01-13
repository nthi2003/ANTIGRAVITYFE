export interface Friend {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    email: string;
    friendshipStatus: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    mutualFriendsCount: number;
    sharedGoalsCount: number;
    isOnline: boolean;
}

export interface FriendRequest {
    id: string;
    fromUser: Friend;
    requestedAt: string;
}

export interface GoalInvitation {
    id: string;
    goal: {
        id: string;
        title: string;
        targetAmount: number;
        currentAmount: number;
    };
    invitedBy: {
        id: string;
        fullName: string;
        avatar: string;
    };
    role: 'OWNER' | 'MEMBER' | 'VIEWER';
    message?: string;
    invitedAt: string;
}

export interface PrivacySettings {
    profileVisibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
    goalsVisibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
    transactionsVisibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
}
