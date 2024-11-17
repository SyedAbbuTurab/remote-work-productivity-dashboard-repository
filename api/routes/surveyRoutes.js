const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createSurvey, getSurveys, getCorrelations } = require('../controllers/surveyController');
const router = express.Router();

router.route('/')
  .post(protect, createSurvey)  // Route to create a new survey
  .get(protect, getSurveys);    // Route to get all surveys
router.get('/correlations', protect, getCorrelations);
module.exports = router;
