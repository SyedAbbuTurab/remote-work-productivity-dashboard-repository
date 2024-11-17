const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { logWorkHours, getWorkHours } = require('../controllers/workHoursController');
const router = express.Router();

router.post('/', protect, logWorkHours);
router.get('/', protect, getWorkHours);

module.exports = router;
