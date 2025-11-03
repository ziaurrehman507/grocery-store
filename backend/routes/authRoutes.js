// const express = require('express');
// const {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile,
// } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// module.exports = router;


const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;