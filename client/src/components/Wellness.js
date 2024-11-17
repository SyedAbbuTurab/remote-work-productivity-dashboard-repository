import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wellness.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faRunning, faSave } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client'; // For real-time notifications

const Wellness = () => {
  // States for reminders and exercises
  const [frequency, setFrequency] = useState();
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [nextBreak, setNextBreak] = useState(null);
  const [socket, setSocket] = useState(null);

  // Socket.io connection for real-time notifications
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Fetch user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await axios.get('http://localhost:5000/api/wellness/reminder-settings', config);
        if (data) {
          setFrequency(data.frequency || 60);
          setRemindersEnabled(data.remindersEnabled);
        }
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
      }
    };
    fetchUserSettings();
  }, []);

  // Listen for real-time notifications from the backend
  useEffect(() => {
    if (socket) {
      socket.on('notification', (message) => {
        toast.info(<div><FontAwesomeIcon icon={faBell} /> {message}</div>, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }
  }, [socket]);

  // Handle form submission for reminder settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post('http://localhost:5000/api/wellness/reminders', { frequency, remindersEnabled }, config);
      toast.success('Settings saved successfully.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings.');
    }
  };

  return (
    <div className="wellness-container">
      <ToastContainer />
      <div className="wellness-header">
        <h2>Wellness & Break Reminders</h2>
      </div>

      <div className="wellness-card">
        <h3><FontAwesomeIcon icon={faBell} /> Break Reminders</h3>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="frequency">Break Frequency (in minutes):</label>
            <input
              type="number"
              id="frequency"
              name="frequency"
              min="1"
              className="input-field"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="toggle">Enable Reminders:</label>
            <div className="toggle-container">
              <input
                type="checkbox"
                id="toggle"
                name="toggle"
                className="toggle-input"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
              />
              <span>{remindersEnabled ? "Enabled" : "Disabled"}</span>
            </div>
          </div>

          <button type="submit" className="save-btn">
            <FontAwesomeIcon icon={faSave} /> Save Settings
          </button>
        </form>
        {nextBreak && <p className="break-time">Next break at: {nextBreak}</p>}
      </div>

      <div className="wellness-card">
        <h3><FontAwesomeIcon icon={faRunning} /> Exercise & Stretching</h3>
        <div className="exercise-list">
          <p>During breaks, try these exercises:</p>
          <ul>
            <li>5-minute stretching routine</li>
            <li>10 squats</li>
            <li>5 push-ups</li>
            <li>1-minute deep breathing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
