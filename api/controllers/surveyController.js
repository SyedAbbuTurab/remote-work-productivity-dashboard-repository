const Survey = require('../models/Survey');
const { body, validationResult } = require('express-validator');

// Create a new survey entry
exports.createSurvey = [
  // Validation middleware
  body('mood').not().isEmpty().withMessage('Mood is required'),
  body('stressLevel').isInt({ min: 1, max: 10 }).withMessage('Stress level must be between 1 and 10'),
  body('energyLevel').isInt({ min: 1, max: 5 }).withMessage('Energy level must be between 1 and 5'),
  body('focusLevel').isInt({ min: 1, max: 5 }).withMessage('Focus level must be between 1 and 5'),
  body('tasksCompleted').isInt({ min: 0 }).withMessage('Tasks completed must be a non-negative number'),
  body('hoursWorked').isFloat({ min: 0, max: 24 }).withMessage('Hours worked must be between 0 and 24'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mood, stressLevel, energyLevel, focusLevel, tasksCompleted, hoursWorked } = req.body;

    try {
      const survey = await Survey.create({
        user: req.user.id,
        mood,
        stressLevel,
        energyLevel,
        focusLevel,
        tasksCompleted,
        hoursWorked,
      });
      res.json(survey);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Get all surveys for the logged-in user
exports.getSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ user: req.user.id }).sort({ date: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Function to calculate Pearson correlation coefficient
function calculatePearsonCorrelation(x, y) {
  const n = x.length;
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_x_sq = x.reduce((a, b) => a + b * b, 0);
  const sum_y_sq = y.reduce((a, b) => a + b * b, 0);
  const sum_xy = x.reduce((sum, xi, idx) => sum + xi * y[idx], 0);

  const numerator = sum_xy - (sum_x * sum_y / n);
  const denominator = Math.sqrt((sum_x_sq - (sum_x * sum_x / n)) * (sum_y_sq - (sum_y * sum_y / n)));

  return denominator === 0 ? 0 : numerator / denominator;
}

// Function to convert mood strings to numbers
function moodToNumber(mood) {
  switch(mood.toLowerCase()) {
    case 'low':
      return 1;
    case 'feeling okay':
    case 'feeling ok':
      return 2;
    case 'great':
      return 3;
    default:
      return 0; // Unknown mood
  }
}

// Controller function to calculate correlations
// Controller function to calculate correlations
exports.getCorrelations = async (req, res) => {
  try {
    const surveys = await Survey.find({ user: req.user.id });

    if (surveys.length < 2) {
      return res.status(400).json({ message: 'Not enough data to calculate correlations.' });
    }

    const mood = surveys.map(s => moodToNumber(s.mood));
    const stressLevel = surveys.map(s => s.stressLevel);
    const energyLevel = surveys.map(s => s.energyLevel);
    const focusLevel = surveys.map(s => s.focusLevel);
    const tasksCompleted = surveys.map(s => s.tasksCompleted);
    const hoursWorked = surveys.map(s => s.hoursWorked);

    console.log('Mood:', mood);
    console.log('Stress Level:', stressLevel);
    console.log('Energy Level:', energyLevel);
    console.log('Focus Level:', focusLevel);
    console.log('Tasks Completed:', tasksCompleted);
    console.log('Hours Worked:', hoursWorked);

    const correlations = {
      moodStress: calculatePearsonCorrelation(mood, stressLevel),
      moodEnergy: calculatePearsonCorrelation(mood, energyLevel),
      moodFocus: calculatePearsonCorrelation(mood, focusLevel),
      moodTasks: calculatePearsonCorrelation(mood, tasksCompleted),
      moodHours: calculatePearsonCorrelation(mood, hoursWorked),
    };

    console.log('Correlations:', correlations);

    res.json(correlations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
