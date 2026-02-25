import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Package, Calendar, MapPin, CheckCircle, Clock, Truck, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);



    if (loading) return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#14b8a6]" size={48} />
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <div className="flex items-center gap-4 mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Orders</h1>
                <div className="h-px flex-grow bg-gray-100"></div>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-8">
                    {orders.map(order => {
                        return (
                            <div key={order._id} className="bg-white rounded-[40px] card-shadow border border-gray-50 overflow-hidden hover-lift transition-all">
                                <div className="bg-gray-50/50 px-8 py-5 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                                            <Calendar size={16} className="text-[#14b8a6]" />
                                            <span>{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                                        <span className="text-gray-400 font-bold tracking-widest text-[10px] uppercase">ID: #{order._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                </div>

                                <div className="p-8 lg:p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                                        <div className="space-y-6">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-2">Order Items</h3>
                                            <div className="space-y-4">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#14b8a6] font-black text-sm">
                                                                {item.quantity}
                                                            </div>
                                                            <span className="text-gray-900 font-bold">{item.name}</span>
                                                        </div>
                                                        <span className="text-gray-500 font-bold font-mono">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-2">Delivery Details</h3>
                                                <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <MapPin size={20} className="text-[#14b8a6] shrink-0" />
                                                    <p className="text-sm font-semibold text-gray-600 leading-relaxed">{order.deliveryAddress}</p>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Paid</span>
                                                <span className="text-4xl font-black text-[#14b8a6] tracking-tighter">₹{order.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <Package size={40} />
                    </div>
                    <p className="text-gray-400 text-lg font-bold">You haven't placed any orders yet.</p>
                    <Link to="/" className="text-[#14b8a6] font-black mt-4 inline-block hover:underline underline-offset-4 tracking-widest text-xs uppercase">Start Ordering</Link>
                </div>
            )}
        </div>
    );
};

export default Orders;
