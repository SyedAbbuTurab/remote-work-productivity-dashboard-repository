const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  category: { type: String },  // New field for category
  tags: [{ type: String }],    // New field for tags
  priority: {                  // New field for priority level
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
});

module.exports = mongoose.model('Task', TaskSchema);
