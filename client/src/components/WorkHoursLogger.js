import React, { useState } from 'react';
import axios from 'axios';

const WorkHoursLogger = () => {
  const [hours, setHours] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/workhours', {
        hours,
      });
      // Handle success, maybe reset the form or give feedback to the user
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Work Hours:</label>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Enter your work hours"
        />
      </div>
      <button type="submit">Log Hours</button>
    </form>
  );
};

export default WorkHoursLogger;
