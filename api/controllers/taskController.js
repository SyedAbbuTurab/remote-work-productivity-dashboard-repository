const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');


exports.createTask = [
  // Validation middleware
  body('title').not().isEmpty().withMessage('Title is required'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, dueDate, category, tags, priority } = req.body;

    try {
      const task = await Task.create({
        user: req.user.id,
        title,
        dueDate,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],  // Convert tags string to array
        priority,
      });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTaskSummary = async (req, res) => {
  try {
    const completedTasks = await Task.countDocuments({ user: req.user.id, completed: true });
    const pendingTasks = await Task.countDocuments({ user: req.user.id, completed: false });

    res.json({ completed: completedTasks, pending: pendingTasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle the completion status of a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle the completed status
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
