import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, MessageSquare, Clock, Trophy, Bell, UserPlus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { friendService, type FriendProfile } from './friendService';
import { leaderboardService, type LeaderboardEntry } from './leaderboardService';
import { RankFrame } from './components/RankFrame';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const SocialPage = () => {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'discover' | 'ranking'>('friends');
    const [friends, setFriends] = useState<FriendProfile[]>([]);
    const [requests, setRequests] = useState<FriendProfile[]>([]);
    const [discover, setDiscover] = useState<FriendProfile[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'friends') {
                const data = await friendService.getFriends();
                setFriends(data);
            } else if (activeTab === 'requests') {
                const data = await friendService.getPendingRequests();
                setRequests(data);
            } else if (activeTab === 'discover') {
                const data = await friendService.discoverUsers();
                setDiscover(data);
            } else if (activeTab === 'ranking') {
                const data = await leaderboardService.getLeaderboard();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (userId: string) => {
        try {
            await friendService.sendRequest(userId);
            const data = await friendService.discoverUsers();
            setDiscover(data);
            toast.success("Đã gửi lời mời kết bạn!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi gửi lời mời");
        }
    };

    const handleAcceptRequest = async (friendshipId: string) => {
        try {
            await friendService.acceptRequest(friendshipId);
            await loadData();
            toast.success("Đã chấp nhận kết bạn!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi chấp nhận");
        }
    };

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const tabs = [
        { id: 'friends', label: 'Bạn bè', count: friends.length, icon: <Users size={18} /> },
        { id: 'requests', label: 'Lời mời', count: requests.length, icon: <Bell size={18} /> },
        { id: 'ranking', label: 'Vinh danh', icon: <Trophy size={18} /> },
        { id: 'discover', label: 'Khám phá', icon: <UserPlus size={18} /> },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-1">
            <header className="pt-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Kết nối</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bạn bè & Cộng đồng</p>

                {/* Search Bar (Hidden in Ranking tab for simplicity) */}
                {activeTab !== 'ranking' && (
                    <div className="mt-6 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bạn bè..."
                            className="w-full bg-white border-0 rounded-2xl p-4 pl-12 shadow-sm text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    </div>
                )}
            </header>

            {/* Tabs Navigation - Scrollable */}
            <div className="overflow-x-auto -mx-6 px-6 pb-2 mb-4 scrollbar-hide">
                <div className="flex p-1 bg-slate-100 rounded-2xl relative min-w-max">
                    <div
                        className="absolute inset-y-1 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
                        style={{
                            width: `calc(${100 / tabs.length}% - 8px)`,
                            left: `calc(${(tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length))}% + 4px)`
                        }}
                    />
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-colors relative z-10 whitespace-nowrap",
                                activeTab === tab.id ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[10px]",
                                    activeTab === tab.id ? "bg-slate-100 text-slate-600" : "bg-white text-slate-400"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-4"
                >
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'friends' && (
                                friends.length === 0 ? (
                                    <EmptyState icon={<Users size={32} />} title="Chưa có bạn bè" desc="Kết nối với bạn bè để cùng nhau quản lý tài chính!" />
                                ) : (
                                    friends.map(friend => <FriendItem key={friend.userId} profile={friend} />)
                                )
                            )}

                            {activeTab === 'requests' && (
                                requests.length === 0 ? (
                                    <EmptyState icon={<Clock size={32} />} title="Không có lời mời nào" desc="Các lời mời kết bạn mới sẽ xuất hiện ở đây." />
                                ) : (
                                    requests.map(req => <RequestItem key={req.userId} profile={req} onAccept={() => handleAcceptRequest(req.userId)} />)
                                )
                            )}

                            {activeTab === 'discover' && (
                                discover.length === 0 ? (
                                    <EmptyState icon={<Users size={32} />} title="Không tìm thấy ai" desc="Mọi người có vẻ đã kết nối hết rồi!" />
                                ) : (
                                    discover.map(user => <DiscoverItem key={user.userId} profile={user} onAdd={() => handleSendRequest(user.userId)} />)
                                )
                            )}

                            {activeTab === 'ranking' && (
                                leaderboard.length === 0 ? (
                                    <EmptyState icon={<Trophy size={32} />} title="Chưa có dữ liệu" desc="Hãy là người đầu tiên ghi danh lên bảng vàng!" />
                                ) : (
                                    <LeaderboardView leaderboard={leaderboard} formatCurrency={formatCurrency} />
                                )
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- Sub Components ---

const LeaderboardView = ({ leaderboard, formatCurrency }: { leaderboard: LeaderboardEntry[], formatCurrency: (v: number) => string }) => {
    // Top 3 Logic
    const top1 = leaderboard[0];
    const top2 = leaderboard[1];
    const top3 = leaderboard[2];
    const rest = leaderboard.slice(3);

    return (
        <div className="space-y-16 pt-8">
            {/* Podium */}
            <div className="flex justify-center items-end gap-2 sm:gap-6 px-2 relative z-10">
                {/* Rank 2 */}
                {top2 && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        <RankFrame rank={2} size={72} alt={top2.fullName} />
                        <div className="mt-2 text-center">
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{top2.fullName}</p>
                            <p className="text-[10px] font-mono text-slate-400">{formatCurrency(top2.totalWealth)}</p>
                        </div>
                    </div>
                )}

                {/* Rank 1 */}
                {top1 && (
                    <div className="flex flex-col items-center -mt-8 z-10 animate-in slide-in-from-bottom-12 duration-700">
                        <div className="relative">
                            <RankFrame rank={1} size={110} alt={top1.fullName} />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                                TOP 1
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm font-black text-slate-800 truncate max-w-[100px]">{top1.fullName}</p>
                            <p className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full mt-1 border border-yellow-100">
                                {formatCurrency(top1.totalWealth)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Rank 3 */}
                {top3 && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        <RankFrame rank={3} size={72} alt={top3.fullName} />
                        <div className="mt-2 text-center">
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{top3.fullName}</p>
                            <p className="text-[10px] font-mono text-slate-400">{formatCurrency(top3.totalWealth)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* List 4-50 */}
            {rest.length > 0 && (
                <div className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-100 space-y-1">
                    {rest.map((entry, index) => (
                        <div key={entry.userId} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                            <span className="text-sm font-bold text-slate-400 w-6 text-center">#{index + 4}</span>
                            <RankFrame rank={index + 4} size={40} alt={entry.fullName} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{entry.fullName}</p>
                                <p className="text-[10px] text-slate-400">@{entry.username}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-600">{formatCurrency(entry.totalWealth)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FriendItem = ({ profile }: { profile: FriendProfile }) => (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
            <RankFrame
                tier={profile.rankTier}
                size={52}
                alt={profile.fullName}
                className="-ml-1"
            />
            <div>
                <h3 className="font-bold text-slate-800 text-sm">{profile.fullName}</h3>
                <p className="text-[10px] text-slate-400 font-bold">{profile.mutualFriendsCount} bạn chung</p>
            </div>
        </div>
        <Button size="sm" variant="ghost" className="rounded-xl h-10 w-10 p-0 text-slate-300 hover:text-primary">
            <MessageSquare size={20} />
        </Button>
    </div>
);

const RequestItem = ({ profile, onAccept }: { profile: FriendProfile, onAccept: () => void }) => (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4 mb-4">
            <RankFrame
                tier={profile.rankTier}
                size={52}
                alt={profile.fullName}
                className="-ml-1"
            />
            <div>
                <h3 className="font-bold text-slate-800 text-sm">{profile.fullName}</h3>
                <p className="text-[10px] text-slate-400 font-bold">Muốn kết nối với bạn</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button size="sm" onClick={onAccept} className="flex-1 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                Chấp nhận
            </Button>
            <Button size="sm" variant="secondary" className="flex-1 rounded-xl bg-slate-50 text-slate-500">
                Xóa
            </Button>
        </div>
    </div>
);

const DiscoverItem = ({ profile, onAdd }: { profile: FriendProfile, onAdd: () => void }) => (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
            <RankFrame
                tier={profile.rankTier}
                size={52}
                alt={profile.fullName}
                className="-ml-1"
            />
            <div>
                <h3 className="font-bold text-slate-800 text-sm">{profile.fullName}</h3>
                <p className="text-[10px] text-slate-400 font-bold truncate max-w-[120px]">{profile.email}</p>
            </div>
        </div>
        <Button size="sm" onClick={onAdd} className="rounded-xl font-bold px-4 hover:shadow-lg hover:shadow-primary/20 transition-all">
            Kết bạn
        </Button>
    </div>
);

const EmptyState = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
        <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 font-bold text-sm">{title}</p>
            <p className="text-slate-400 text-[10px] font-medium mt-1 max-w-[200px]">{desc}</p>
        </div>
    </div>
);
