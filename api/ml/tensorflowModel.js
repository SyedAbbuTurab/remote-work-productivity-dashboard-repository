// ml/tensorflowModel.js
const tf = require('@tensorflow/tfjs');

// Preprocess data for TensorFlow
const preprocessData = (data) => {
  const inputs = [];
  const outputs = [];

  data.forEach((entry) => {
    inputs.push([entry.hoursWorked, entry.breaks, entry.tasksCompleted, entry.stressLevel]);  // Example inputs
    outputs.push(entry.productivity);  // Example output
  });

  return { inputs, outputs };
};

// Create and Train the TensorFlow Model
const createAndTrainModel = async (inputs, outputs) => {
  const inputTensor = tf.tensor2d(inputs);
  const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, inputShape: [4], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  console.log('Training model...');
  await model.fit(inputTensor, outputTensor, { epochs: 50 });
  console.log('Model trained.');

  return model;
};

// Predict Productivity
const predictProductivity = async (req, res) => {
    try {
      const { workHours, breaks, tasksCompleted } = req.body;
  
      // Validate inputs
      if (typeof workHours === 'undefined' || typeof breaks === 'undefined' || typeof tasksCompleted === 'undefined') {
        return res.status(400).json({ message: 'Missing input values' });
      }
  
      // Simulate a productivity prediction logic (use your AI model here if needed)
      const predictedProductivity = (workHours * 0.5) + (breaks * 0.2) + (tasksCompleted * 0.3);
  
      // Return predicted productivity
      res.status(200).json({ predictedProductivity });
  
    } catch (error) {
      console.error('Error predicting productivity:', error);
      res.status(500).json({ message: 'Failed to predict productivity' });
    }
  };
  

module.exports = { preprocessData, createAndTrainModel, predictProductivity };
