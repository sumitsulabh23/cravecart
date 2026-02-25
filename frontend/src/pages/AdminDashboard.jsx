import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
    Users,
    Utensils,
    ShoppingBag,
    IndianRupee,
    Clock,
    Plus,
    Settings,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resRes, orderRes] = await Promise.all([
                    api.get('/restaurants'),
                    api.get('/orders')
                ]);

                const orders = orderRes.data;
                const revenue = orders.filter(o => o.status === 'Delivered').reduce((acc, curr) => acc + curr.totalAmount, 0);
                const pending = orders.filter(o => o.status === 'Pending').length;

                setStats({
                    totalUsers: 'N/A',
                    totalRestaurants: resRes.data.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    pendingOrders: pending
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, shadow }) => (
        <div className={`bg-white p-8 rounded-[40px] card-shadow border border-gray-50 flex items-center gap-6 group hover-lift transition-all relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 ${color}/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className={`p-5 rounded-2xl ${color} text-white relative z-10 shadow-lg ${shadow}`}>
                <Icon size={28} />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#14b8a6]" size={48} />
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Overview of your CraveCart ecosystem</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/admin/restaurants" className="btn-teal px-8 py-4 shadow-teal-500/20">
                        <Plus size={20} />
                        Management
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="bg-blue-500" shadow="shadow-blue-500/30" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={IndianRupee} color="bg-emerald-500" shadow="shadow-emerald-500/30" />
                <StatCard title="Restaurants" value={stats.totalRestaurants} icon={Utensils} color="bg-[#14b8a6]" shadow="shadow-teal-500/30" />
                <StatCard title="Pending" value={stats.pendingOrders} icon={Clock} color="bg-amber-500" shadow="shadow-amber-500/30" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-10 rounded-[40px] card-shadow border border-gray-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-full -mr-24 -mt-24 blur-3xl"></div>

                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quick Missions</h2>
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                            <Settings size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        <Link to="/admin/restaurants" className="p-8 bg-gray-50 rounded-[32px] hover:bg-[#14b8a6]/5 group border-2 border-transparent hover:border-[#14b8a6]/10 transition-all duration-300">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#14b8a6] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                <Utensils size={28} />
                            </div>
                            <span className="font-extrabold text-gray-900 flex items-center gap-2 group-hover:text-[#14b8a6] transition-colors">Restaurants <ExternalLink size={16} /></span>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Add, remove or edit kitchen details</p>
                        </Link>

                        <Link to="/admin/orders" className="p-8 bg-gray-50 rounded-[32px] hover:bg-blue-50 group border-2 border-transparent hover:border-blue-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                <ShoppingBag size={28} />
                            </div>
                            <span className="font-extrabold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">Orders <ExternalLink size={16} /></span>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Track delivery and order statuses</p>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] card-shadow border border-gray-50 overflow-hidden relative">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full -ml-24 -mb-24 blur-3xl opacity-50"></div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-10 tracking-tight">System Vitality</h2>
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center p-6 bg-emerald-50/50 rounded-[28px] border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center gap-4 text-emerald-700">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                <span className="font-bold">Database Core</span>
                            </div>
                            <span className="px-5 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-lg shadow-emerald-500/20">Active</span>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-blue-50/50 rounded-[28px] border border-blue-100/50 hover:bg-blue-50 transition-colors">
                            <div className="flex items-center gap-4 text-blue-700">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="font-bold">Cloud Images</span>
                            </div>
                            <span className="px-5 py-1.5 bg-blue-500 text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-lg shadow-blue-500/20">Stable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
