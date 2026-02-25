const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');

        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [], totalAmount: 0 });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { foodId, quantity } = req.body;

    try {
        const food = await FoodItem.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ foodId, quantity: quantity || 1 });
        }

        // Calculate total amount
        let total = 0;
        for (const item of cart.items) {
            const f = await FoodItem.findById(item.foodId);
            total += f.price * item.quantity;
        }
        cart.totalAmount = total;

        const updatedCart = await cart.save();
        const populatedCart = await updatedCart.populate('items.foodId');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:foodId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            cart.items = cart.items.filter(item => item.foodId.toString() !== req.params.foodId);

            // Recalculate total amount
            let total = 0;
            for (const item of cart.items) {
                const f = await FoodItem.findById(item.foodId);
                total += f.price * item.quantity;
            }
            cart.totalAmount = total;

            const updatedCart = await cart.save();
            const populatedCart = await updatedCart.populate('items.foodId');
            res.json(populatedCart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
            res.json({ message: 'Cart cleared' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
