import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import bell icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

import About from './components/About';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'; // For protected routes
import ProductivityPredictor from './components/ProductivityPredictor';
import Profile from './components/Profile';
import Register from './components/Register';
import Survey from './components/Survey';
import TaskManager from './components/TaskManager';
import Wellness from './components/Wellness';

const App = () => {
  const [frequency, setFrequency] = useState(60);  // Break reminder frequency in minutes
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    if (remindersEnabled) {
      scheduleBreakNotification();
    }
  }, [frequency, remindersEnabled]);

  const scheduleBreakNotification = () => {
    if (!remindersEnabled) return;

    // Schedule the next break notification
    setTimeout(() => {
      showNotification();
      scheduleBreakNotification(); // Recursively schedule the next notification
    }, frequency * 60000); // Convert minutes to milliseconds
  };

  const showNotification = () => {
    toast.info(
      <div>
        <FontAwesomeIcon icon={faBell} /> Time to take a break!
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  return (
    <Router>
      <Navbar /> {/* Add Navbar for consistent navigation */}
      
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
                    <Route path="/predictor" element={<ProductivityPredictor />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/survey"
            element={
              <PrivateRoute>
                <Survey />
              </PrivateRoute>
            }
          />
          <Route
            path="/wellness"
            element={
              <PrivateRoute>
                <Wellness />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<Profile />} /> {/* Profile route */}
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
        </Routes>
      </div>
      
      <ToastContainer /> {/* Global Toast Container for Notifications */}
    </Router>
  );
};

export default App;
