import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/api';

const Cart = () => {
    const { cart, addToCart, removeFromCart, clearCart, loading } = useContext(CartContext);
    const [address, setAddress] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address) return alert('Please enter delivery address');

        setPlacingOrder(true);
        try {
            await api.post('/orders', {
                deliveryAddress: address,
                paymentMethod: 'COD' // Default for now
            });
            await clearCart();
            navigate('/orders');
        } catch (error) {
            console.error(error);
            alert('Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#14b8a6]" size={48} />
        </div>
    );

    if (!cart || cart.items.length === 0) return (
        <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm text-gray-300">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">Looks like you haven't discovered any cravings yet. Let's find something delicious!</p>
                <Link to="/" className="btn-teal inline-flex px-10 py-4 shadow-teal-500/20">
                    Browse Restaurants
                </Link>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
                <div className="h-px flex-grow bg-gray-100"></div>
                <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors group"
                >
                    <Trash2 size={16} className="group-hover:shake" />
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.foodId._id} className="bg-white p-5 rounded-[32px] card-shadow border border-gray-50 flex items-center gap-6 group hover-lift transition-all">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                                    <img src={item.foodId.image} alt={item.foodId.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{item.foodId.name}</h3>
                                    <p className="text-[#14b8a6] font-black mt-1">₹{item.foodId.price}</p>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                    <button
                                        onClick={() => removeFromCart(item.foodId._id)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-gray-400 hover:text-[#14b8a6] hover:shadow-sm transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="font-black text-gray-900 w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart(item.foodId._id)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-gray-400 hover:text-[#14b8a6] hover:shadow-sm transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div className="text-right min-w-[100px] pr-4">
                                    <p className="font-black text-gray-900 text-lg">₹{item.foodId.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:sticky lg:top-28">
                    <div className="bg-white p-8 lg:p-10 rounded-[40px] shadow-2xl shadow-teal-900/5 border border-teal-50/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#14b8a6]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 relative z-10">Order Summary</h2>

                        <div className="space-y-4 border-b border-gray-50 pb-8 mb-8 relative z-10">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span className="text-gray-900 font-bold">₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Delivery Fee</span>
                                <span className="text-[#14b8a6] font-black tracking-widest text-[10px] uppercase bg-[#14b8a6]/10 px-3 py-1 rounded-full">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-10 relative z-10">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                            <span className="text-4xl font-black text-[#14b8a6] tracking-tight">₹{cart.totalAmount}</span>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Delivery Address</label>
                                <textarea
                                    required
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700 min-h-[120px] resize-none"
                                    placeholder="Where should we bring your food?"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Payment Method</label>
                                <div className="flex items-center gap-4 p-5 border-2 border-[#14b8a6] bg-[#14b8a6]/5 rounded-2xl shadow-sm">
                                    <div className="bg-[#14b8a6] p-2 rounded-lg text-white">
                                        <CreditCard size={20} />
                                    </div>
                                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={placingOrder}
                                className="w-full btn-teal text-lg py-5 shadow-[#14b8a6]/30 group"
                            >
                                {placingOrder ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>
                                        <span>Confirm Order</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
