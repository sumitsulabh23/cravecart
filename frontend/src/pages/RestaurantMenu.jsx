import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import FoodCard from '../components/FoodCard';
import { ArrowLeft, Loader2, Info, MapPin } from 'lucide-react';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/restaurants/${id}`);
                const foodRes = await api.get(`/foods/restaurant/${id}`);
                setRestaurant(res.data);
                setFoods(foodRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#14b8a6]" size={48} />
        </div>
    );

    if (!restaurant) return (
        <div className="container mx-auto px-6 py-20 text-center">
            <p className="text-gray-500 text-xl font-bold">Restaurant not found</p>
            <Link to="/" className="text-[#14b8a6] mt-4 inline-block font-bold hover:underline">Back to Home</Link>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#14b8a6] font-bold text-sm transition-all group">
                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-[#14b8a6]/10 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                Back to Restaurants
            </Link>

            <div className="bg-white rounded-[40px] p-8 lg:p-12 card-shadow border border-gray-50 flex flex-col md:flex-row gap-12 items-center md:items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#14b8a6]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden shadow-2xl shadow-teal-900/10 relative z-10">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>

                <div className="flex-grow space-y-6 relative z-10 text-center md:text-left">
                    <div>
                        <div className="inline-block px-3 py-1 bg-[#14b8a6]/10 text-[#14b8a6] rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
                            Premium Kitchen
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{restaurant.name}</h1>
                    </div>

                    <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">{restaurant.description}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100/50">
                            <MapPin size={18} className="text-[#14b8a6]" />
                            <span className="text-sm font-semibold">{restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100/50">
                            <Info size={18} className="text-blue-500" />
                            <span className="text-sm font-semibold">Fast Delivery • 30 mins</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Menu Highlights</h2>
                    <div className="h-px flex-grow bg-gray-100"></div>
                </div>

                {foods.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {foods.map(food => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">No menu items discovered yet.</p>
                        <p className="text-gray-300 text-sm mt-1">Select another kitchen or check back later.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default RestaurantMenu;
