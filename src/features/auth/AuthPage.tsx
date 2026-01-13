import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../utils/api';

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { username: email, password } // backend login accepts username or email in 'username' field
                : { username, email, password, fullName };

            const response = await api.post(endpoint, payload);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200"
            >
                <header className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-primary/30">
                        C
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        {isLogin ? 'Track your discipline today' : 'Join the elite money savers'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary transition-all text-sm"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary transition-all text-sm"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={isLogin ? "Email or Username" : "Email"}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary transition-all text-sm"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary transition-all text-sm"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 font-bold ml-1">{error}</p>
                    )}

                    <Button
                        fullWidth
                        size="lg"
                        className="rounded-2xl h-14"
                        isLoading={loading}
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                        {!loading && <ArrowRight className="ml-2" size={18} />}
                    </Button>
                </form>

                <footer className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};
