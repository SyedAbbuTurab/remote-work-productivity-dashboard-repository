const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateEmail, updatePassword } = require('../controllers/profileController');
const router = express.Router();

router.get('/', protect, getProfile); // Route to get profile information
router.put('/email', protect, updateEmail);
router.put('/password', protect, updatePassword);

module.exports = router;
