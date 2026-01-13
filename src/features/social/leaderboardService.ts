import { api } from '../../utils/api';

export interface LeaderboardEntry {
    userId: string;
    fullName: string;
    username: string;
    totalWealth: number;
    rankTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
}

export const leaderboardService = {
    getLeaderboard: (): Promise<LeaderboardEntry[]> => api.get('/leaderboard'),
};
