const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Import http to create a server
const { Server } = require('socket.io'); // Import Socket.IO

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const taskRoutes = require('./routes/taskRoutes');
const workHoursRoutes = require('./routes/workHoursRoutes');
const profileRoutes = require('./routes/profileRoutes.js');
const wellnessRoutes = require('./routes/wellnessRoutes.js');
const WellnessSettings = require('./models/WellnessSettings'); // Import the WellnessSettings model

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err));

// Use your routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workhours', workHoursRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/wellness', wellnessRoutes);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Emit notifications based on user settings
const emitUserReminders = async () => {
  try {
    // Get all users' wellness settings
    const wellnessSettings = await WellnessSettings.find({ remindersEnabled: true });

    // For each user with reminders enabled, emit a notification based on their frequency
    wellnessSettings.forEach((setting) => {
      const reminderInterval = setting.frequency * 60000; // Convert minutes to milliseconds
      console.log("reminderInterval", reminderInterval)

      setInterval(() => {
        // Emit notification to this user
        io.emit('notification', `Time to take a break! Your break reminder interval is set to ${setting.frequency} minutes.`);
      }, reminderInterval);
    });
  } catch (error) {
    console.error('Error emitting user reminders:', error);
  }
};

// Run the function to emit user-specific reminders
emitUserReminders();

// Serve frontend
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Use server.listen instead of app.listen
