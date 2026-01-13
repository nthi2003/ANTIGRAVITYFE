import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Landmark, Coins, Briefcase, Plus, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { accountService, type Account } from './accountService';
import { formatCurrency } from '../../utils/format';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const AccountsPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const [formState, setFormState] = useState<{
        name: string;
        type: string;
        balance: string | number;
        currency: string;
        creditLimit: string | number;
    }>({ name: '', type: 'CASH', balance: '', currency: 'VND', creditLimit: '' });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await accountService.getMyAccounts();
            setAccounts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'CASH': return <Coins className="text-amber-500" />;
            case 'BANK': return <Landmark className="text-blue-500" />;
            case 'CREDIT': return <CreditCard className="text-rose-500" />;
            case 'E_WALLET': return <Wallet className="text-purple-500" />;
            case 'INVESTMENT': return <Briefcase className="text-emerald-500" />;
            default: return <Wallet className="text-slate-500" />;
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    const handleCreateAccount = async () => {
        try {
            await accountService.createAccount({
                ...formState,
                balance: Number(formState.balance),
                creditLimit: Number(formState.creditLimit)
            } as any);
            await fetchAccounts();
            setIsAddModalOpen(false);
            setFormState({ name: '', type: 'CASH', balance: '', currency: 'VND', creditLimit: '' });
            toast.success("Đã thêm tài khoản mới!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm tài khoản");
        }
    };

    const handleUpdateAccount = async () => {
        if (!editingAccount) return;
        try {
            await accountService.updateAccount(editingAccount.id, {
                ...formState,
                balance: Number(formState.balance),
                creditLimit: Number(formState.creditLimit)
            } as any);
            await fetchAccounts();
            setIsEditModalOpen(false);
            setEditingAccount(null);
            setFormState({ name: '', type: 'CASH', balance: '', currency: 'VND', creditLimit: '' });
            toast.success("Đã cập nhật tài khoản!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật tài khoản");
        }
    };

    const handleDeleteAccount = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
        try {
            await accountService.deleteAccount(id);
            // Cập nhật UI ngay lập tức
            setAccounts(prev => prev.filter(acc => acc.id !== id));
            await fetchAccounts();
            toast.success("Đã xóa tài khoản!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xóa tài khoản");
        }
    };

    const openEditModal = (acc: Account) => {
        setEditingAccount(acc);
        setFormState({
            name: acc.name,
            type: acc.type,
            balance: acc.balance.toString(),
            currency: acc.currency,
            creditLimit: acc.creditLimit?.toString() || ''
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="pt-2 flex justify-between items-center px-1">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tài khoản</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quản lý nguồn tiền của bạn</p>
                </div>
                <Button size="sm" onClick={() => {
                    setFormState({ name: '', type: 'CASH', balance: '', currency: 'VND', creditLimit: '' });
                    setIsAddModalOpen(true);
                }} className="rounded-2xl h-10 w-10 p-0 shadow-lg shadow-primary/20">
                    <Plus size={20} />
                </Button>
            </header>

            {/* Total Balance Card */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden mx-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Tổng số dư</p>
                <h2 className="text-3xl font-black tracking-tighter">{formatCurrency(totalBalance)}</h2>

                <div className="mt-8 flex gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {accounts.length} Tài khoản
                    </div>
                </div>
            </div>

            {/* Account List */}
            <div className="space-y-3 px-1">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Danh sách tài khoản</h3>
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : accounts.map((acc, i) => (
                    <motion.div
                        key={acc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-inner border border-transparent">
                                    {getAccountIcon(acc.type)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{acc.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{acc.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={cn(
                                    "font-black text-sm tracking-tight",
                                    acc.balance < 0 ? "text-rose-500" : "text-slate-800"
                                )}>
                                    {formatCurrency(acc.balance)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(acc)}
                                    className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-xl"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteAccount(acc.id)}
                                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:bg-rose-50 rounded-xl"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <ChevronRight size={16} className="text-slate-200" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl space-y-4"
                    >
                        <h2 className="text-xl font-black text-slate-800">
                            {isAddModalOpen ? 'Thêm tài khoản' : 'Sửa tài khoản'}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-500">Tên tài khoản</label>
                                <input
                                    className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold mt-1"
                                    value={formState.name}
                                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    placeholder="Ví dụ: Ví tiền mặt"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500">Loại</label>
                                <select
                                    className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold mt-1"
                                    value={formState.type}
                                    onChange={e => setFormState({ ...formState, type: e.target.value })}
                                >
                                    <option value="CASH">Tiền mặt</option>
                                    <option value="BANK">Ngân hàng</option>
                                    <option value="CREDIT">Tín dụng</option>
                                    <option value="E_WALLET">Ví điện tử</option>
                                    <option value="INVESTMENT">Đầu tư</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500">Số dư hiện tại</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold mt-1"
                                    value={formState.balance}
                                    onChange={e => setFormState({ ...formState, balance: e.target.value })}
                                    placeholder="0"
                                />
                            </div>

                            {formState.type === 'CREDIT' && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Hạn mức tín dụng</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold mt-1"
                                        value={formState.creditLimit}
                                        onChange={e => setFormState({ ...formState, creditLimit: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button variant="secondary" onClick={() => {
                                setIsAddModalOpen(false);
                                setIsEditModalOpen(false);
                            }} className="flex-1">Hủy</Button>
                            <Button onClick={isAddModalOpen ? handleCreateAccount : handleUpdateAccount} className="flex-1">
                                {isAddModalOpen ? 'Thêm' : 'Lưu'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

