const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('customer'));

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:foodId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
