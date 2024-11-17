const mongoose = require('mongoose');

const WellnessDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  productivity: { type: Number, required: true }, // Example: Scale from 1-10
  mood: { type: Number, required: true }, // Example: Scale from 1-5
  tasksCompleted: { type: Number, required: true }, // Number of tasks completed
  stressLevel: { type: Number, required: true }, // Stress level on a scale
  hoursWorked: { type: Number, required: true }, // Hours worked per day
});

// Prevent model overwrite error
module.exports = mongoose.models.WellnessData || mongoose.model('WellnessData', WellnessDataSchema);
