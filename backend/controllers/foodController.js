const FoodItem = require('../models/FoodItem');

// @desc    Get all food items for a restaurant
// @route   GET /api/foods/restaurant/:restaurantId
// @access  Public
const getFoodsByRestaurant = async (req, res) => {
    try {
        const foods = await FoodItem.find({
            restaurantId: req.params.restaurantId,
            isAvailable: true
        });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
const createFoodItem = async (req, res) => {
    try {
        const { restaurantId, name, price, category } = req.body;
        const image = req.file ? req.file.path : '';

        if (!restaurantId || !name || !price || !category || !image) {
            return res.status(400).json({ success: false, message: 'All fields including image are required' });
        }

        const Restaurant = require('../models/Restaurant');
        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid price' });
        }

        const foodItem = new FoodItem({
            restaurantId,
            name,
            price: parsedPrice,
            category,
            image
        });

        const createdFood = await foodItem.save();
        res.status(201).json({
            success: true,
            message: "Dish added successfully",
            food: createdFood
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFoodItem = async (req, res) => {
    const { name, price, category, isAvailable } = req.body;

    try {
        const foodItem = await FoodItem.findById(req.params.id);

        if (foodItem) {
            foodItem.name = name || foodItem.name;
            foodItem.price = price || foodItem.price;
            foodItem.category = category || foodItem.category;
            foodItem.isAvailable = isAvailable !== undefined ? isAvailable : foodItem.isAvailable;

            if (req.file) {
                foodItem.image = req.file.path;
            }

            const updatedFood = await foodItem.save();
            res.json(updatedFood);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);

        if (foodItem) {
            await FoodItem.deleteOne({ _id: req.params.id });
            res.json({ message: 'Food item removed' });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFoodsByRestaurant,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem
};
