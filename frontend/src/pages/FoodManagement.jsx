import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { Plus, Edit, Trash2, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const FoodManagement = () => {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        image: null
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [resRes, foodRes] = await Promise.all([
                api.get(`/restaurants/${restaurantId}`),
                api.get(`/foods/restaurant/${restaurantId}`)
            ]);
            setRestaurant(resRes.data);
            setFoods(foodRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [restaurantId]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this dish?')) return;
        try {
            await api.delete(`/foods/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('restaurantId', restaurantId);
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editMode) {
                await api.put(`/foods/${currentId}`, data);
                toast.success('Dish updated successfully');
            } else {
                await api.post('/foods', data);
                toast.success('Dish added successfully');
            }
            setShowModal(false);
            fetchData();
            setFormData({ name: '', price: '', category: '', image: null });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const openEdit = (food) => {
        setEditMode(true);
        setCurrentId(food._id);
        setFormData({
            name: food.name,
            price: food.price,
            category: food.category,
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
                    <Link to="/admin/restaurants" className="p-3 hover:bg-gray-100 rounded-2xl transition text-gray-400 hover:text-[#14b8a6]">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#14b8a6] bg-[#14b8a6]/10 px-2 py-0.5 rounded-md">Menu Management</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{restaurant?.name}</h1>
                    </div>
                </div>
                <button
                    onClick={() => { setEditMode(false); setFormData({ name: '', price: '', category: '', image: null }); setShowModal(true); }}
                    className="btn-teal px-8 py-4 shadow-teal-500/20"
                >
                    <Plus size={20} /> Add New Dish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {foods.map(food => (
                    <div key={food._id} className="bg-white rounded-[40px] p-2 card-shadow border border-gray-50 flex flex-col group hover-lift transition-all relative overflow-hidden">
                        <div className="relative aspect-square rounded-[32px] overflow-hidden mb-4 shadow-inner">
                            <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <button onClick={() => openEdit(food)} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-[#14b8a6] shadow-lg hover:bg-white transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(food._id)} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-lg hover:bg-white transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="px-5 pb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-[#14b8a6] transition-colors">{food.name}</h3>
                                <div className="text-[#14b8a6] font-black text-lg">₹{food.price}</div>
                            </div>
                            <span className="inline-block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                {food.category}
                            </span>
                        </div>
                    </div>
                ))}

                {foods.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-sm">
                            <ImageIcon size={40} />
                        </div>
                        <p className="text-gray-400 text-lg font-bold">Your menu is empty.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-[#14b8a6] font-black mt-4 hover:underline underline-offset-4 tracking-widest text-xs uppercase"
                        >
                            Add Your First Dish
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-[#14b8a6]/5 rounded-full -ml-24 -mt-24 blur-3xl"></div>

                        <div className="p-10 lg:p-12 relative z-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
                                {editMode ? 'Refine' : 'Add New'} Dish
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Dish Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Truffle Pasta"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Price (₹)</label>
                                        <input
                                            type="number" required
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all placeholder:text-gray-300 text-gray-700"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="499"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                                        <select
                                            required
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/5 outline-none transition-all text-gray-700 font-bold"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="Starters">Starters</option>
                                            <option value="Main Course">Main Course</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Desserts">Desserts</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Dish Image</label>
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
                                            {formData.image ? formData.image.name : 'Choose a mouth-watering image'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 btn-teal py-4 shadow-[#14b8a6]/20"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Dish'}
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

export default FoodManagement;
