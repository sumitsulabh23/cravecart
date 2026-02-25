import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-[#14b8a6] flex items-center gap-2 tracking-tight">
                    <div className="bg-[#14b8a6] p-1.5 rounded-lg text-white">
                        <ShoppingBag size={22} fill="currentColor" />
                    </div>
                    <span>CraveCart</span>
                </Link>

                <div className="flex items-center gap-8">
                    {user ? (
                        <>
                            <Link to="/cart" className="relative text-gray-600 hover:text-[#14b8a6] transition-colors">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#14b8a6] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
                                <Link to="/orders" className="text-gray-600 hover:text-[#14b8a6] font-medium flex items-center gap-2 text-sm transition-colors">
                                    <User size={18} />
                                    <span>{user.name}</span>
                                </Link>

                                {(user.role === 'admin' || user.role === 'owner') && (
                                    <Link to="/admin" className="text-gray-600 hover:text-[#14b8a6] font-medium flex items-center gap-2 text-sm transition-colors">
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                )}

                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 p-2 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" className="text-gray-600 hover:text-[#14b8a6] font-semibold px-5 py-2.5 transition-colors">Login</Link>
                            <Link to="/register" className="btn-teal">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
