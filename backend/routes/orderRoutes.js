// const express = require('express');
// const {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderToPaid,
//   updateOrderToDelivered,
//   updateOrderStatus,
//   getOrders
// } = require('../controllers/orderController');
// const { protect, admin } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.route('/')
//   .post(protect, createOrder)
//   .get(protect, admin, getOrders);

// router.route('/myorders').get(protect, getMyOrders);

// router.route('/:id')
//   .get(protect, getOrderById);

// router.route('/:id/pay').put(protect, updateOrderToPaid);
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
// router.route('/:id/status').put(protect, admin, updateOrderStatus);

// module.exports = router;



const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateOrder, handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, validateOrder, handleValidationErrors, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;