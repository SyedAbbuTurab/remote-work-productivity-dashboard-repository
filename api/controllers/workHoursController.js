const WorkHours = require('../models/WorkHours');

exports.logWorkHours = async (req, res) => {
  const { hours } = req.body;

  try {
    const workHours = new WorkHours({
      user: req.user.id,
      hours,
    });
    console.log("workHours", req.user.id,
      hours)

    const savedWorkHours = await workHours.save();
    res.status(201).json(savedWorkHours);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getWorkHours = async (req, res) => {
  try {
    const workHours = await WorkHours.find({ user: req.user.id });
    res.json(workHours);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
