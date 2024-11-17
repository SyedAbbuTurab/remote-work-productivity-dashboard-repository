import React, { useState } from 'react';

const ProductivityForm = ({ onSubmit }) => {
  const [workHours, setWorkHours] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure that the inputs are converted to numbers before passing to the model
    onSubmit({
      workHours: Number(workHours),
      breaks: Number(breaks),
      tasksCompleted: Number(tasksCompleted),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Work Hours:
        <input 
          type="number" 
          value={workHours} 
          onChange={(e) => setWorkHours(e.target.value)} 
        />
      </label>
      <label>
        Breaks:
        <input 
          type="number" 
          value={breaks} 
          onChange={(e) => setBreaks(e.target.value)} 
        />
      </label>
      <label>
        Tasks Completed:
        <input 
          type="number" 
          value={tasksCompleted} 
          onChange={(e) => setTasksCompleted(e.target.value)} 
        />
      </label>
      <button type="submit">Predict Productivity</button>
    </form>
  );
};

export default ProductivityForm;
