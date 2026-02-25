const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const User = require('./models/User');

dotenv.config();

// Connect to Database
connectDB();

const seedData = async () => {
    try {
        console.log('Seeding process started...');

        // Clear existing restaurant and food data
        await Restaurant.deleteMany();
        await FoodItem.deleteMany();
        console.log('Cleared existing Restaurants and Foods.');

        // Find an admin user to assign as owner. If none exists, script will throw error to ensure proper setup.
        const adminUser = await User.findOne({ role: { $in: ['admin', 'owner'] } });

        if (!adminUser) {
            console.error('No admin/owner user found! Please create an admin account before seeding.');
            process.exit(1);
        }

        const ownerId = adminUser._id;

        const restaurantsToSeed = [
            {
                name: 'Delhi Spice Hub',
                description: 'Authentic North Indian Cuisine',
                address: 'Connaught Place, New Delhi',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', // Restaurant image placeholder
                isActive: true,
                owner: ownerId,
                foods: [
                    { name: 'Butter Chicken', price: 349, category: 'Main Course' },
                    { name: 'Paneer Butter Masala', price: 299, category: 'Main Course' },
                    { name: 'Dal Makhani', price: 249, category: 'Main Course' },
                    { name: 'Tandoori Roti', price: 25, category: 'Breads' },
                    { name: 'Garlic Naan', price: 45, category: 'Breads' },
                    { name: 'Chicken Biryani', price: 329, category: 'Main Course' },
                    { name: 'Veg Biryani', price: 279, category: 'Main Course' }
                ]
            },
            {
                name: 'Mumbai Street Eats',
                description: 'Famous Mumbai Street Food',
                address: 'Bandra West, Mumbai',
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', // Restaurant image placeholder
                isActive: true,
                owner: ownerId,
                foods: [
                    { name: 'Vada Pav', price: 30, category: 'Snacks' },
                    { name: 'Pav Bhaji', price: 120, category: 'Snacks' },
                    { name: 'Misal Pav', price: 140, category: 'Snacks' },
                    { name: 'Pani Puri', price: 50, category: 'Snacks' },
                    { name: 'Sev Puri', price: 60, category: 'Snacks' },
                    { name: 'Bombay Sandwich', price: 110, category: 'Snacks' }
                ]
            },
            {
                name: 'Chennai Dosa Corner',
                description: 'Traditional South Indian Dishes',
                address: 'T Nagar, Chennai',
                image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e', // Restaurant image placeholder
                isActive: true,
                owner: ownerId,
                foods: [
                    { name: 'Plain Dosa', price: 80, category: 'Main Course' },
                    { name: 'Masala Dosa', price: 120, category: 'Main Course' },
                    { name: 'Idli Sambar', price: 70, category: 'Main Course' },
                    { name: 'Medu Vada', price: 60, category: 'Snacks' },
                    { name: 'Uttapam', price: 130, category: 'Main Course' },
                    { name: 'Filter Coffee', price: 40, category: 'Beverages' }
                ]
            },
            {
                name: 'Kolkata Royal Kitchen',
                description: 'Authentic Bengali Cuisine',
                address: 'Park Street, Kolkata',
                image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9', // Restaurant image placeholder
                isActive: true,
                owner: ownerId,
                foods: [
                    { name: 'Mutton Kosha', price: 399, category: 'Main Course' },
                    { name: 'Fish Curry', price: 329, category: 'Main Course' },
                    { name: 'Luchi', price: 40, category: 'Breads' },
                    { name: 'Cholar Dal', price: 150, category: 'Main Course' },
                    { name: 'Rasgulla', price: 25, category: 'Desserts' },
                    { name: 'Mishti Doi', price: 60, category: 'Desserts' }
                ]
            },
            {
                name: 'Jaipur Rajasthani Thali',
                description: 'Traditional Rajasthani Food',
                address: 'MI Road, Jaipur',
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', // Restaurant image placeholder
                isActive: true,
                owner: ownerId,
                foods: [
                    { name: 'Dal Baati Churma', price: 299, category: 'Main Course' },
                    { name: 'Gatte Ki Sabzi', price: 199, category: 'Main Course' },
                    { name: 'Ker Sangri', price: 220, category: 'Main Course' },
                    { name: 'Bajra Roti', price: 35, category: 'Breads' },
                    { name: 'Rajasthani Thali', price: 399, category: 'Main Course' }
                ]
            }
        ];

        for (const resData of restaurantsToSeed) {
            const { foods, ...restaurantInfo } = resData;

            // Create Restaurant
            const restaurant = new Restaurant(restaurantInfo);
            const savedRestaurant = await restaurant.save();
            console.log(`Created Restaurant: ${savedRestaurant.name}`);

            // Create Foods for this Restaurant
            const foodsToInsert = foods.map(food => ({
                restaurantId: savedRestaurant._id,
                name: food.name,
                price: food.price,
                category: food.category,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', // Food image placeholder
                isAvailable: true
            }));

            await FoodItem.insertMany(foodsToInsert);
            console.log(`  -> Added ${foodsToInsert.length} foods.`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedData();
