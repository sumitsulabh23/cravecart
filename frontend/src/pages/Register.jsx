import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const { register, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            // Error handled by context
        }
    };

    return (
        <div className="min-h-[90vh] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden bg-white">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#14b8a6]/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#14b8a6]/10 rounded-full -ml-36 -mb-36 blur-3xl opacity-40"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-[#14b8a6]/10 rounded-2xl flex items-center justify-center text-[#14b8a6] mb-6">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                <p className="text-gray-500 font-medium">Join CraveCart to start your premium food experience</p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
                <div className="bg-white py-10 px-8 lg:px-10 rounded-[40px] card-shadow border border-gray-50">
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 mb-8 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <p className="text-red-700 text-xs font-bold uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <button
                                type="button"
                                onClick={() => setRole('customer')}
                                className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border-2 transition-all duration-300 ${role === 'customer' ? 'bg-[#14b8a6] border-[#14b8a6] text-white shadow-lg shadow-teal-500/20' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('owner')}
                                className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border-2 transition-all duration-300 ${role === 'owner' ? 'bg-[#14b8a6] border-[#14b8a6] text-white shadow-lg shadow-teal-500/20' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                            >
                                Owner
                            </button>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-teal text-lg py-4 shadow-teal-500/30"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#14b8a6] font-bold hover:underline underline-offset-4 ml-1">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
