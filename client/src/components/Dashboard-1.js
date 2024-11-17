import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faHeartbeat, faExclamationTriangle, faCoffee, faCheck } from '@fortawesome/free-solid-svg-icons';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [taskSummary, setTaskSummary] = useState({ completed: 0, pending: 0 });
  const [moodData, setMoodData] = useState([]);
  const [workHoursData, setWorkHoursData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [correlations, setCorrelations] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const taskRes = await axios.get('http://localhost:5000/api/tasks/summary', config);
        const moodRes = await axios.get('http://localhost:5000/api/surveys', config);
        const workHoursRes = await axios.get('http://localhost:5000/api/workhours', config);
        const correlationsRes = await axios.get('http://localhost:5000/api/surveys/correlations', config);

        setTaskSummary(taskRes.data);
        setMoodData(moodRes.data);
        setWorkHoursData(workHoursRes.data);
        setCorrelations(correlationsRes.data);

        // Generate insights based on the data
        setInsights(generateInsights(taskRes.data, moodRes.data, workHoursRes.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const generateInsights = (tasks, mood, workHours) => {
    const insightsList = [];

    if (mood.length > 0 && mood[mood.length - 1].stressLevel > 7) {
      insightsList.push({
        type: 'warning',
        icon: faExclamationTriangle,
        message: "Your stress level has been high recently. Consider taking short breaks."
      });
    }

    if (workHours.reduce((total, entry) => total + entry.hours, 0) > 40) {
      insightsList.push({
        type: 'info',
        icon: faCoffee,
        message: "You've been working a lot this week. Make sure to get enough rest."
      });
    }

    if (tasks.completed > tasks.pending) {
      insightsList.push({
        type: 'success',
        icon: faCheck,
        message: "Great job! You've completed most of your tasks. Keep it up!"
      });
    } else {
      insightsList.push({
        type: 'info',
        icon: faSmile,
        message: "You still have some pending tasks. Let's focus on getting those done."
      });
    }

    return insightsList;
  };

  // Helper function to map mood descriptions to numerical values
  const mapMoodToNumber = (mood) => {
    switch (mood) {
      case 'Very Happy':
        return 5;
      case 'Happy':
        return 4;
      case 'Neutral':
        return 3;
      case 'Sad':
        return 2;
      case 'Very Sad':
        return 1;
      default:
        return 3; // Neutral if unknown
    }
  };

  // Map mood descriptions to numeric values for plotting
  const moodValues = moodData.map(entry => mapMoodToNumber(entry.mood));

  const moodChartData = {
    labels: moodData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood',
        data: moodValues,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: 'Stress Level',
        data: moodData.map(entry => entry.stressLevel),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const moodChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10, // Set the y-axis max value to 10 for better scaling
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          callback: function(value) {
            switch (value) {
              case 1:
                return 'Very Sad';
              case 2:
                return 'Sad';
              case 3:
                return 'Neutral';
              case 4:
                return 'Happy';
              case 5:
                return 'Very Happy';
              default:
                return value;
            }
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const workHoursChartData = {
    labels: workHoursData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Work Hours',
        data: workHoursData.map(entry => entry.hours),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const workHoursChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getCorrelationBadge = (value) => {
    if (value >= 0.5) {
      return <span className="badge bg-success">Strong Positive</span>;
    } else if (value <= -0.5) {
      return <span className="badge bg-danger">Strong Negative</span>;
    } else if (value > 0) {
      return <span className="badge bg-warning text-dark">Weak Positive</span>;
    } else if (value < 0) {
      return <span className="badge bg-warning text-dark">Weak Negative</span>;
    } else {
      return <span className="badge bg-secondary">No Correlation</span>;
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="task-summary-container">
        <div className="task-card">
          <i className="fas fa-check-circle"></i>
          <div className="task-info">
            <h4>Completed</h4>
            <p>{taskSummary.completed}</p>
          </div>
        </div>
        <div className="task-card">
          <i className="fas fa-tasks"></i>
          <div className="task-info">
            <h4>Pending</h4>
            <p>{taskSummary.pending}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper line-chart">
          <h3>Mood & Stress Trends</h3>
          <Line data={moodChartData} options={moodChartOptions} />
        </div>

        <div className="chart-wrapper bar-chart">
          <h3>Work Hours</h3>
          <Bar data={workHoursChartData} options={workHoursChartOptions} />
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Insights & Suggestions</h3>
        <ul className="list-group">
          {insights.map((insight, index) => (
            <li key={index} className={`list-group-item list-group-item-${insight.type}`}>
              <FontAwesomeIcon icon={insight.icon} /> {insight.message}
            </li>
          ))}
        </ul>
      </div>

      {correlations && (
        <div className="dashboard-section">
          <h3>Correlation Analysis</h3>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Mood vs Stress Level
              <span>{correlations.moodStress?.toFixed(2) ?? 'N/A'} {getCorrelationBadge(correlations.moodStress)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Mood vs Energy Level
              <span>{correlations.moodEnergy?.toFixed(2) ?? 'N/A'} {getCorrelationBadge(correlations.moodEnergy)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Mood vs Focus Level
              <span>{correlations.moodFocus?.toFixed(2) ?? 'N/A'} {getCorrelationBadge(correlations.moodFocus)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Mood vs Tasks Completed
              <span>{correlations.moodTasks?.toFixed(2) ?? 'N/A'} {getCorrelationBadge(correlations.moodTasks)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Mood vs Hours Worked
              <span>{correlations.moodHours?.toFixed(2) ?? 'N/A'} {getCorrelationBadge(correlations.moodHours)}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
