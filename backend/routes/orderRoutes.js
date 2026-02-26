const express = require('express');
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorizeRoles('customer'), createOrder);
router.get('/myorders', protect, authorizeRoles('customer'), getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
