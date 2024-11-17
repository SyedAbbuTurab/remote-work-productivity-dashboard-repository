const express = require('express');
const { addWellnessReminder, getWellnessData, getWellnessPrediction, getWellnessReminderSettings, postWellnessPrediction } = require('../controllers/WellnessController');
const { protect } = require('../middleware/authMiddleware');
const { predictProductivity } = require('../controllers/predictionController');
const router = express.Router();

router.post('/reminders', protect, addWellnessReminder);
router.get('/data', protect, getWellnessData);
router.get('/prediction', protect, getWellnessPrediction); // New route for TensorFlow prediction
// router.post('/prediction', predictProductivity);
router.post('/prediction', protect, postWellnessPrediction);
router.get('/reminder-settings', protect, getWellnessReminderSettings); 

module.exports = router;
