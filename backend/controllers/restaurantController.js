const Restaurant = require('../models/Restaurant');

// @desc    Get all active restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
    try {
        let query = { isActive: true };

        // If owner, show only their restaurants
        if (req.user && req.user.role === 'owner') {
            query = { owner: req.user._id };
        } else if (req.user && req.user.role === 'admin') {
            query = {}; // Admin sees all
        }

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        const image = req.file ? req.file.path : '';

        if (!name || !description || !address || !image) {
            return res.status(400).json({ success: false, message: 'All fields including image are required' });
        }

        const restaurant = new Restaurant({
            name,
            description,
            address,
            image,
            owner: req.user._id
        });

        const createdRestaurant = await restaurant.save();
        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            restaurant: createdRestaurant
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
    const { name, description, address, isActive } = req.body;

    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            restaurant.name = name || restaurant.name;
            restaurant.description = description || restaurant.description;
            restaurant.address = address || restaurant.address;
            restaurant.isActive = isActive !== undefined ? isActive : restaurant.isActive;

            if (req.file) {
                restaurant.image = req.file.path;
            }

            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            await Restaurant.deleteOne({ _id: req.params.id });
            res.json({ message: 'Restaurant removed' });
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
