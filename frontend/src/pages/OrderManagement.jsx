import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ShoppingBag, Loader2, ArrowLeft, CheckCircle, Clock, Truck, User, MapPin, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };



    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" size={48} /></div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-4">
                <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft /></Link>
                <h1 className="text-3xl font-black text-gray-800">Order Management</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
                        <div className="p-8 lg:w-2/3 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                    <h3 className="text-lg font-black text-gray-800">#{order._id.toUpperCase()}</h3>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><User size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400">Customer</p>
                                            <p className="font-bold text-gray-800">{order.userId?.name}</p>
                                            <p className="text-xs text-gray-500">{order.userId?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><MapPin size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400">Delivery Address</p>
                                            <p className="text-sm font-medium leading-tight">{order.deliveryAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items</p>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-medium">{item.quantity}x {item.name}</span>
                                            <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t flex justify-between font-black text-lg text-orange-600">
                                        <span>Total</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 lg:w-1/3 flex flex-col justify-center gap-4">
                            <p className="text-sm font-bold text-gray-400 text-center mb-2">Update Order Status</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => updateStatus(order._id, 'Preparing')}
                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-2xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition text-sm font-bold"
                                >
                                    <Package size={16} /> Preparing
                                </button>
                                <button
                                    onClick={() => updateStatus(order._id, 'Out for Delivery')}
                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-2xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition text-sm font-bold"
                                >
                                    <Truck size={16} /> Out
                                </button>
                                <button
                                    onClick={() => updateStatus(order._id, 'Delivered')}
                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-2xl hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition text-sm font-bold col-span-2"
                                >
                                    <CheckCircle size={16} /> Mark Delivered
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 font-bold">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
