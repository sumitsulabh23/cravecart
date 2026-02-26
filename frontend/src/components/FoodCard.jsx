import React, { useContext } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const FoodCard = ({ food }) => {
    const { cart, addToCart, removeFromCart } = useContext(CartContext);

    const cartItem = cart?.items?.find(item => item.foodId?._id === food._id || item.foodId === food._id);
    const quantity = cartItem?.quantity || 0;

    return (
        <div className="bg-white rounded-[28px] card-shadow border border-gray-50 p-4 flex gap-5 h-44 hover-lift transition-all">
            <div className="relative w-36 h-36 rounded-[20px] overflow-hidden flex-shrink-0 shadow-inner">
                <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop'; }}
                />
            </div>

            <div className="flex-grow flex flex-col justify-between py-1">
                <div className="space-y-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-gray-900 text-lg leading-tight tracking-tight">{food.name}</h4>
                    </div>
                    <div className="inline-block bg-[#14b8a6]/5 text-[#14b8a6] text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                        {food.category}
                    </div>
                    <p className="text-[#14b8a6] font-black text-lg mt-2 tracking-tight">₹{food.price}</p>
                </div>

                <div className="flex justify-end mt-auto">
                    {quantity > 0 ? (
                        <div className="flex items-center gap-4 bg-[#14b8a6] text-white px-2 py-1.5 rounded-xl shadow-lg shadow-[#14b8a6]/20">
                            <button
                                onClick={() => removeFromCart(food._id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="font-black text-sm w-4 text-center">{quantity}</span>
                            <button
                                onClick={() => addToCart(food._id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(food._id)}
                            className="bg-white border-2 border-[#14b8a6] text-[#14b8a6] font-black px-6 py-2 rounded-xl hover:bg-[#14b8a6] hover:text-white transition-all shadow-sm shadow-teal-100 flex items-center gap-2 text-sm active:scale-95"
                        >
                            <Plus size={16} />
                            <span>Add</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
