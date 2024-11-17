import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import CorrelationAnalysis from './CorrelationAnalysis';
import './Dashboard.css';

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
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
        max: 10,
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

      <CorrelationAnalysis
        correlations={correlations}
        moodData={moodData}
        workHoursData={workHoursData}
        taskSummary={taskSummary}
      />
    </div>
  );
};

export default Dashboard;
