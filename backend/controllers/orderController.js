const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { deliveryAddress, paymentMethod } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = cart.items.map(item => ({
            foodId: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            quantity: item.quantity
        }));

        const order = new Order({
            userId: req.user._id,
            items: orderItems,
            totalAmount: cart.totalAmount,
            deliveryAddress,
            paymentMethod
        });

        const createdOrder = await order.save();

        // Clear cart after order
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Validation for status flow could be added here
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
