const { preprocessData, createAndTrainModel, predictProductivity } = require('../ml/tensorflowModel');
const WellnessSettings = require('../models/WellnessSettings');
const WorkHours = require('../models/WorkHours');
const Survey = require('../models/Survey');
const WellnessData = require('../models/WellnessData');
const tf = require('@tensorflow/tfjs');

// Add Wellness Reminder
exports.addWellnessReminder = async (req, res) => {
  try {
    const { frequency, remindersEnabled } = req.body;
    const userId = req.user.id;

    let wellnessSetting = await WellnessSettings.findOne({ user: userId });

    if (wellnessSetting) {
      wellnessSetting.frequency = frequency;
      wellnessSetting.remindersEnabled = remindersEnabled;
    } else {
      wellnessSetting = new WellnessSettings({
        user: userId,
        frequency,
        remindersEnabled,
      });
    }

    await wellnessSetting.save();
    res.status(201).json({ message: 'Wellness reminder saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Wellness Reminder Settings
exports.getWellnessReminderSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const wellnessSetting = await WellnessSettings.findOne({ user: userId });
    
    if (wellnessSetting) {
      res.json(wellnessSetting);
    } else {
      res.status(404).json({ message: 'Wellness settings not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Wellness Data
exports.getWellnessData = async (req, res) => {
  try {
    const userId = req.user.id;
    const wellnessData = await Survey.find({ user: userId }).sort({ date: -1 });

    res.json(wellnessData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to preprocess data for TensorFlow
// const preprocessData = (data) => {
//   const inputs = [];
//   const outputs = [];

//   data.forEach((entry) => {
//     inputs.push([entry.hoursWorked, entry.tasksCompleted, entry.stressLevel]); // Example inputs
//     outputs.push(entry.productivity || entry.mood); // Example output
//   });

//   return { inputs, outputs };
// };

// Train TensorFlow Model
const trainModel = async (inputs, outputs) => {
  const inputTensor = tf.tensor2d(inputs);
  const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, inputShape: [3], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  await model.fit(inputTensor, outputTensor, { epochs: 50 });
  return model;
};


// Fetch and Preprocess Data, Train Model, and Predict
exports.getWellnessPrediction = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch data from MongoDB
    const workHours = await WorkHours.find({ user: userId });
    const surveys = await Survey.find({ user: userId });
    const wellnessData = await WellnessData.find({ user: userId });

    const data = [...workHours, ...surveys, ...wellnessData];
    const { inputs, outputs } = preprocessData(data);

    // Train the model
    const model = await createAndTrainModel(inputs, outputs);

    // Example input for prediction (new data)
    const predictionInput = [8, 2, 3, 4];  // [hoursWorked, breaks, tasksCompleted, stressLevel]
    const predictedProductivity = predictProductivity(model, predictionInput);

    res.status(200).json({ predictedProductivity });
  } catch (error) {
    console.error('Error during training or prediction:', error);
    res.status(500).json({ message: 'Failed to predict productivity' });
  }
};

exports.postWellnessPrediction = async (req, res) => {
  try {
    const { workHours, breaks, tasksCompleted, stressLevel } = req.body;

    // Fetch user data from MongoDB
    const userId = req.user.id;
    const workHoursData = await WorkHours.find({ user: userId });
    const surveyData = await Survey.find({ user: userId });
    const wellnessData = await WellnessData.find({ user: userId });

    // Combine all data for training
    const data = [...workHoursData, ...surveyData, ...wellnessData];
    const { inputs, outputs } = preprocessData(data);

    // Train the model with past data
    const model = await createAndTrainModel(inputs, outputs);

    // Create input tensor for the current prediction
    const predictionInput = [workHours, breaks, tasksCompleted, stressLevel]; // User-provided inputs
    const predictedProductivity = predictProductivity(model, predictionInput);

    // Return the predicted productivity value
    res.status(200).json({ predictedProductivity });
  } catch (error) {
    console.error('Error predicting productivity:', error);
    res.status(500).json({ message: 'Failed to predict productivity' });
  }
};


