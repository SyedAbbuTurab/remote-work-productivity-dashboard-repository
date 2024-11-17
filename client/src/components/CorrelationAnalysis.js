import React, { useEffect, useState } from 'react';
import './Correalation.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faExclamationTriangle, faCheckCircle, faFrown, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const AdvancedCorrelationAnalysis = ({ correlations, moodData, workHoursData, taskSummary }) => {
  const [advice, setAdvice] = useState([]);

  useEffect(() => {
    generateAdvancedAdvice();
  }, [correlations, moodData, workHoursData, taskSummary]);

  const generateAdvancedAdvice = () => {
    const newAdvice = [];

    // Dynamic Mood & Stress Insights
    const recentMood = moodData[moodData.length - 1]?.mood || 'Neutral';
    const recentStress = moodData[moodData.length - 1]?.stressLevel || 0;
    if (recentStress > 7) {
      newAdvice.push({
        type: 'warning',
        icon: faExclamationTriangle,
        message: `Your stress levels are high, and you've reported being ${recentMood.toLowerCase()}. Consider taking breaks or practicing relaxation techniques.`,
      });
    }

    // Work Hours vs Mood Insights
    const avgWorkHours = workHoursData.reduce((sum, entry) => sum + entry.hours, 0) / workHoursData.length;
    if (avgWorkHours > 7) {
      newAdvice.push({
        type: 'info',
        icon: faArrowDown,
        message: `You've been working more than 7 hours a day on average. It's important to take regular breaks to maintain your mental health.`,
      });
    }

    // Task Productivity Insights
    if (taskSummary.completed < taskSummary.pending) {
      newAdvice.push({
        type: 'info',
        icon: faFrown,
        message: `You're falling behind on your tasks. Break them down into smaller chunks and prioritize what's most important.`,
      });
    } else {
      newAdvice.push({
        type: 'success',
        icon: faCheckCircle,
        message: `Great work! You've completed most of your tasks. Keep up the productivity and reward yourself for the progress.`,
      });
    }

    // Predictive Suggestion
    if (avgWorkHours > 8 && recentStress > 7) {
      newAdvice.push({
        type: 'warning',
        icon: faExclamationTriangle,
        message: `You're at risk of burnout based on your current working hours and stress levels. Consider taking a day off or doing a relaxing activity.`,
      });
    } else if (avgWorkHours < 6) {
      newAdvice.push({
        type: 'info',
        icon: faArrowUp,
        message: `You might want to consider working a bit more consistently. Low work hours can impact task completion and long-term productivity.`,
      });
    }

    setAdvice(newAdvice);
  };

  return (
    <div className="dashboard-section">
      <h3>Advanced Real-Time Insights & Predictions</h3>
      <ul className="list-group">
        {advice.map((item, index) => (
          <li key={index} className={`list-group-item list-group-item-${item.type}`}>
            <FontAwesomeIcon icon={item.icon} /> {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvancedCorrelationAnalysis;
