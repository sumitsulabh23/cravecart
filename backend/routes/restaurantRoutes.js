const express = require('express');
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

router.post('/', protect, admin, upload.single('image'), createRestaurant);
router.put('/:id', protect, admin, upload.single('image'), updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

module.exports = router;
