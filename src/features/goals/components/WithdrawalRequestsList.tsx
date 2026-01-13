import { useState, useEffect } from 'react';
import { Check, X, Clock, User } from 'lucide-react';
import { goalService, type WithdrawalRequest } from '../goalService';
import { formatCurrency } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { toast } from 'sonner';

interface WithdrawalRequestsListProps {
    goalId: string;
    currentUser: { id: string } | null;
}

export const WithdrawalRequestsList = ({ goalId, currentUser }: WithdrawalRequestsListProps) => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await goalService.getWithdrawals(goalId);
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [goalId]);

    const handleAction = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await goalService.approveWithdrawal(requestId, status);
            toast.success(status === 'APPROVED' ? "Đã phê duyệt!" : "Đã từ chối!");
            fetchRequests();
        } catch (err: any) {
            toast.error(err.message || "Không thể thực hiện");
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Clock size={16} className="animate-spin text-slate-300" /></div>;
    if (requests.length === 0) return null;

    return (
        <div className="mt-4 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Yêu cầu rút tiền đang chờ ({requests.filter(r => r.status === 'PENDING').length})</h4>
            {requests.map((request) => (
                <div key={request.id} className="bg-slate-50 rounded-3xl p-4 border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <User size={20} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800">{formatCurrency(request.amount)}</h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Gửi bởi: {request.requesterName}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter",
                            request.status === 'PENDING' ? "bg-amber-100 text-amber-600" :
                                request.status === 'APPROVED' ? "bg-emerald-100 text-emerald-600" :
                                    "bg-rose-100 text-rose-600"
                        )}>
                            {request.status === 'PENDING' ? 'Chờ duyệt' : request.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                        </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-4 bg-white/50 p-2 rounded-xl border border-slate-50 leading-relaxed italic">
                        "{request.description}"
                    </p>

                    <div className="space-y-2 mb-4">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1 border-b border-slate-100 pb-1">Trạng thái phê duyệt các bên</p>
                        <div className="flex flex-wrap gap-2">
                            {request.approvals.map((approval) => (
                                <div key={approval.userId} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-50">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        approval.status === 'APPROVED' ? "bg-emerald-500" :
                                            approval.status === 'REJECTED' ? "bg-rose-500" : "bg-slate-200"
                                    )} />
                                    <span className="text-[10px] font-bold text-slate-600">{approval.userName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {request.status === 'PENDING' && (
                        <div className="flex gap-2">
                            {/* Only show buttons if current user hasn't approved yet or is part of the request */}
                            {request.approvals.find(a => a.userId === currentUser?.id)?.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleAction(request.id, 'APPROVED')}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Check size={14} /> Phê duyệt
                                    </button>
                                    <button
                                        onClick={() => handleAction(request.id, 'REJECTED')}
                                        className="flex-1 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <X size={14} /> Từ chối
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
