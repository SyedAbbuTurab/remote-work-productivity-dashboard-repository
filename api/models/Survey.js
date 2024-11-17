const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true },
  stressLevel: { type: Number, required: true, min: 1, max: 10 },
  energyLevel: { type: Number, required: true, min: 1, max: 5 }, // New field
  focusLevel: { type: Number, required: true, min: 1, max: 5 },  // New field
  tasksCompleted: { type: Number, required: true, min: 0 },      // New field
  hoursWorked: { type: Number, required: true, min: 0, max: 24 }, // New field
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Survey', SurveySchema);
