// models/WellnessSettings.js
const mongoose = require('mongoose');

const WellnessSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frequency: { type: Number, required: true },  // Frequency of reminders in minutes
  remindersEnabled: { type: Boolean, default: true }, // Whether reminders are enabled
}, {
  timestamps: true,
});

module.exports = mongoose.model('WellnessSettings', WellnessSettingsSchema);
