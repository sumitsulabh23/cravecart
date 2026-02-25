import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Utensils, Edit, Trash2, Plus, Loader2, ArrowLeft, Image as ImageIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RestaurantManagement = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        image: null
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchRestaurants = async () => {
        try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this kitchen?')) return;
        try {
            await api.delete(`/restaurants/${id}`);
            fetchRestaurants();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('address', formData.address);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editMode) {
                await api.put(`/restaurants/${currentId}`, data);
                toast.success('Restaurant updated successfully');
            } else {
                await api.post('/restaurants', data);
                toast.success('Restaurant created successfully');
            }
            setShowModal(false);
            fetchRestaurants();
            setFormData({ name: '', description: '', address: '', image: null });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const openEdit = (res) => {
        setEditMode(true);
        setCurrentId(res._id);
        setFormData({
            name: res.name,
            description: res.description,
            address: res.address,
            image: null
        });
        setShowModal(true);
    };

    if (loading) return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#14b8a6]" size={48} />
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-3 hover:bg-gray-100 rounded-2xl transition text-gray-400 hover:text-[#14b8a6]">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Kitchen Fleet</h1>
                        <p className="text-gray-500 font-medium">Manage your restaurant locations and details</p>
                    </div>
                </div>
                <button
                    onClick={() => { setEditMode(false); setFormData({ name: '', description: '', address: '', image: null }); setShowModal(true); }}
                    className="btn-teal px-8 py-4 shadow-teal-500/20"
                >
                    <Plus size={20} /> Add New Kitchen
                </button>
            </div>

            <div className="bg-white rounded-[40px] card-shadow border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preview</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kitchen Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {restaurants.map(res => (
                                <tr key={res._id} className="hover:bg-[#14b8a6]/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
                                            <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-extrabold text-gray-900 text-lg">{res.name}</div>
                                        <div className="text-xs text-gray-400 font-medium mt-1 truncate max-w-xs">{res.description}</div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-600 font-semibold text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-[#14b8a6]" />
                                            {res.address}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center gap-3">
                                            <Link
                                                to={`/admin/restaurants/${res._id}/foods`}
                                                className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                                                title="Manage Menu"
                                            >
                                                <Utensils size={20} />
                                            </Link>
                                            <button
                                                onClick={() => openEdit(res)}
                                                className="p-3 text-[#14b8a6] hover:bg-[#14b8a6]/10 rounded-xl transition-all hover:scale-110"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res._id)}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#14b8a6]/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>

                        <div className="p-10 lg:p-12 relative z-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
                                {editMode ? 'Edit' : 'Add New'} Kitchen
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Kitchen Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Italian Bistro"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
                                    <textarea
                                        required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700 min-h-[100px] resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief details about the kitchen..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Address</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Street, City, Zip"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Cover Image</label>
                                    <div className="relative border-2 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-[#14b8a6]/5 hover:border-[#14b8a6]/20 transition-all cursor-pointer group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            required={!editMode}
                                        />
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#14b8a6] mb-4 group-hover:scale-110 transition-transform">
                                            <ImageIcon size={24} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 group-hover:text-[#14b8a6] transition-colors">
                                            {formData.image ? formData.image.name : 'Click to discover images'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition"
                                    > Cancel </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 btn-teal py-4 shadow-[#14b8a6]/20"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Kitchen'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantManagement;
