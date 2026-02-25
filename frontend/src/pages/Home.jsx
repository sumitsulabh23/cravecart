import React, { useState, useEffect } from 'react';
import api from '../api/api';
import RestaurantCard from '../components/RestaurantCard';
import { Search, UtensilsCrossed, Loader2 } from 'lucide-react';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await api.get('/restaurants');
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden mb-16">
                {/* Visual Blob/Curve Background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-[#14b8a6]/5 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-[#14b8a6]/10 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center relative z-10">
                    <div className="lg:w-1/2 text-left space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-[#14b8a6]/10 text-[#14b8a6] rounded-full text-xs font-bold tracking-wider uppercase">
                            Premium Food Delivery
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Fresh Food <br />
                            <span className="text-[#14b8a6]">Minimal Effort.</span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                            Discover the best local restaurants with CraveCart. A professional, lightning-fast platform built for your daily cravings.
                        </p>

                        <div className="relative max-w-md group">
                            <div className="absolute inset-0 bg-[#14b8a6]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 flex p-1 border-opacity-50">
                                <div className="flex-grow relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="What are you craving?"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 outline-none placeholder:text-gray-400 text-sm md:text-base"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="hidden sm:flex bg-[#14b8a6] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0d9488] transition-all shadow-lg shadow-[#14b8a6]/30 active:scale-95 items-center gap-2">
                                    Discover
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-sm text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]"></div>
                                500+ Restaurants
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]"></div>
                                Fast Delivery
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg h-[400px] lg:h-[500px]">
                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-50 rounded-3xl -rotate-12"></div>
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 border-4 border-teal-100 rounded-full"></div>

                            <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"
                                alt="Delicious Healthy Food"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10 hover-lift"
                            />

                            {/* Floating Stats Card */}
                            <div className="absolute bottom-10 -left-6 lg:-left-12 bg-white p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-4 border border-gray-50">
                                <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500">
                                    <UtensilsCrossed size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Top Rated</p>
                                    <p className="text-gray-800 font-bold">4.9/5 Average</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurants Section */}
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Restaurants</h2>
                        <p className="text-gray-500 mt-1">Curated selection of premium kitchens near you</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg font-bold">
                            {filteredRestaurants.length} Results
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-[#14b8a6]" size={48} />
                            <p className="text-gray-400 font-medium">Finding kitchens...</p>
                        </div>
                    </div>
                ) : filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {filteredRestaurants.map(restaurant => (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <div className="max-w-xs mx-auto space-y-4">
                            <div className="bg-white w-16 h-16 rounded-2xl shadow-sm mx-auto flex items-center justify-center text-gray-300">
                                <Search size={32} />
                            </div>
                            <p className="text-gray-500 text-lg font-bold">No kitchens match your search</p>
                            <p className="text-gray-400 text-sm">Try searching for something else, like "Pizza" or "Biryani".</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-[#14b8a6] font-bold hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
