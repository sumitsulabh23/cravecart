const express = require('express');
const {
    getFoodsByRestaurant,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

router.get('/restaurant/:restaurantId', getFoodsByRestaurant);

router.post('/', protect, admin, upload.single('image'), createFoodItem);
router.put('/:id', protect, admin, upload.single('image'), updateFoodItem);
router.delete('/:id', protect, admin, deleteFoodItem);

module.exports = router;
