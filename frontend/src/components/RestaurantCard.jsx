import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link
            to={`/restaurant/${restaurant._id}`}
            className="group bg-white rounded-[32px] overflow-hidden card-shadow hover-lift block border border-transparent hover:border-teal-100 transition-all"
        >
            <div className="relative h-56 overflow-hidden m-2 rounded-[24px]">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[#14b8a6] font-bold text-xs shadow-sm">
                    <Star size={14} fill="currentColor" />
                    <span>4.5</span>
                </div>
            </div>

            <div className="p-6 pt-2">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-[#14b8a6] transition-colors leading-tight">
                        {restaurant.name}
                    </h3>
                </div>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {restaurant.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                        <MapPin size={14} className="text-[#14b8a6]/60" />
                        <span className="truncate max-w-[120px]">{restaurant.address}</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#14b8a6] bg-[#14b8a6]/5 px-3 py-1 rounded-full">
                        Open Now
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
