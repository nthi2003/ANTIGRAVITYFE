import { useState, useEffect } from 'react';
import { Search, UserPlus, X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { userService, type User } from '../../../services/userService';
import { goalService } from '../goalService';
import { toast } from 'sonner';

interface AddMemberModalProps {
    goalId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddMemberModal = ({ goalId, isOpen, onClose, onSuccess }: AddMemberModalProps) => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [searching, setSearching] = useState(false);
    const [addingId, setAddingId] = useState<string | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setUsers([]);
            return;
        }

        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const results = await userService.searchUsers(query);
                setUsers(results);
            } catch (err) {
                console.error(err);
            } finally {
                setSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleAdd = async (username: string, userId: string) => {
        setAddingId(userId);
        try {
            await goalService.addMember(goalId, {
                username,
                role: 'MEMBER',
                targetAmount: 0 // Default target
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Thêm thành viên thất bại. Có thể thành viên đã tồn tại.");
        } finally {
            setAddingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="relative z-[101] bg-white rounded-[32px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Thêm thành viên</h3>
                    <button onClick={onClose} className="text-slate-400 p-2 hover:bg-slate-50 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo username hoặc email..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={18} />}
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        {user.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{user.fullName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">@{user.username}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="rounded-xl h-10 w-10 p-0"
                                    isLoading={addingId === user.id}
                                    onClick={() => handleAdd(user.username, user.id)}
                                >
                                    <UserPlus size={18} />
                                </Button>
                            </div>
                        ))}

                        {query.length >= 2 && users.length === 0 && !searching && (
                            <p className="text-center text-slate-400 text-sm py-4">Không tìm thấy người dùng nào.</p>
                        )}

                        {query.length < 2 && (
                            <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest py-4">
                                Nhập ít nhất 2 ký tự để tìm kiếm
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
