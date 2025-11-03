// const express = require('express');
// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   getCategories
// } = require('../controllers/productController');
// const { protect, admin } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// const router = express.Router();

// router.route('/')
//   .get(getProducts)
//   .post(protect, admin, upload.single('image'), createProduct);

// router.get('/categories', getCategories);

// router.route('/:id')
//   .get(getProductById)
//   .put(protect, admin, upload.single('image'), updateProduct)
//   .delete(protect, admin, deleteProduct);

// module.exports = router;

const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateProduct, handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), validateProduct, handleValidationErrors, createProduct);

router.get('/categories', getCategories);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), validateProduct, handleValidationErrors, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;