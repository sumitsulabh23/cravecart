import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (foodId, quantity = 1) => {
        try {
            const { data } = await api.post('/cart', { foodId, quantity });
            setCart(data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            const { data } = await api.delete(`/cart/${foodId}`);
            setCart(data);
        } catch (err) {
            console.error(err);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart');
            setCart({ items: [], totalAmount: 0 });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
