import React, { useState } from 'react';
import axios from 'axios';
import './Survey.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faHeartbeat, faBolt, faBullseye, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const Survey = () => {
  const [mood, setMood] = useState('Neutral');
  const [stressLevel, setStressLevel] = useState(1);
  const [energyLevel, setEnergyLevel] = useState(1);
  const [focusLevel, setFocusLevel] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/surveys',
        { mood, stressLevel, energyLevel, focusLevel, tasksCompleted, hoursWorked },
        config
      );
      const { dataHours } = await axios.post(
        'http://localhost:5000/api/workhours',
        { hours: hoursWorked },
        config
      );
      setMessage('Survey submitted successfully!');
      setMood('Neutral');
      setStressLevel(1);
      setEnergyLevel(1);
      setFocusLevel(1);
      setTasksCompleted(0);
      setHoursWorked(0);
    } catch (error) {
      console.error('Failed to submit survey:', error);
      setMessage('Failed to submit survey');
    }
  };

  return (
    <div className="container survey-form">
      <h2 className="text-center mb-4">Daily Productivity Survey</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faSmile} className="icon" /> Mood
          </label>
          <select
            className="form-control"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="Very Happy">Very Happy</option>
            <option value="Happy">Happy</option>
            <option value="Neutral">Neutral</option>
            <option value="Sad">Sad</option>
            <option value="Very Sad">Very Sad</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faHeartbeat} className="icon" /> Stress Level (1 to 10)
          </label>
          <input
            type="number"
            className="form-control"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faBolt} className="icon" /> Energy Level (1 to 5)
          </label>
          <input
            type="number"
            className="form-control"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            min="1"
            max="5"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faBullseye} className="icon" /> Focus Level (1 to 5)
          </label>
          <input
            type="number"
            className="form-control"
            value={focusLevel}
            onChange={(e) => setFocusLevel(parseInt(e.target.value))}
            min="1"
            max="5"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faCheckCircle} className="icon" /> Tasks Completed
          </label>
          <input
            type="number"
            className="form-control"
            value={tasksCompleted}
            onChange={(e) => setTasksCompleted(parseInt(e.target.value))}
            min="0"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faClock} className="icon" /> Hours Worked
          </label>
          <input
            type="number"
            className="form-control"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(parseInt(e.target.value))}
            min="0"
            max="24"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {message && <p className="mt-3 message">{message}</p>}
    </div>
  );
};

export default Survey;
