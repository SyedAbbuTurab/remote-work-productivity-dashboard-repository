import React from 'react';
import './About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faChartLine, faHeart, faBell, faClipboard, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Welcome to Your Productivity Partner</h1>
        <p>Helping you manage your tasks, track your wellness, and stay productive in the remote work era.</p>
      </div>

      <div className="about-content">
        <h2>Features at a Glance</h2>

        <div className="features-grid">
          <div className="feature-box">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
            <h3>Dashboard</h3>
            <p>Track tasks, productivity, and mood all in one place. Get an overview of your accomplishments and what needs attention.</p>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faTasks} className="feature-icon" />
            <h3>Task Management</h3>
            <p>Manage daily and project-based tasks, set deadlines, and monitor progress efficiently over time.</p>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faBell} className="feature-icon" />
            <h3>Wellness and Break Reminders</h3>
            <p>Stay healthy by taking regular breaks. Our app suggests quick exercises and tracks the effects on your productivity.</p>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faHeart} className="feature-icon" />
            <h3>Wellness Insights</h3>
            <p>Analyze how your productivity correlates with your wellness activities, mood, and stress levels.</p>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faClipboard} className="feature-icon" />
            <h3>Daily Surveys</h3>
            <p>Complete short surveys to log your mood, energy, stress, and work hours, helping you stay consistent.</p>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faHourglassHalf} className="feature-icon" />
            <h3>Work Hours Tracking</h3>
            <p>Visualize your work hours and break times through detailed charts, helping you maintain balance.</p>
          </div>
        </div>

        <h2>Why This App Matters</h2>
        <p className="about-text">
          In the era of remote work, it’s easy to fall into the trap of overworking, leading to burnout and reduced productivity. 
          Our app is built to help you manage your work, stay productive, and ensure you are taking care of your mental and physical health. 
          Whether you’re a freelancer or part of a team, our app provides you with the tools you need to stay focused while maintaining a healthy work-life balance.
        </p>

        <h2>Who Can Benefit?</h2>
        <p className="about-text">
          From freelancers and remote workers to teams working in different time zones, this app caters to anyone looking to track their productivity while keeping wellness a priority.
          It’s perfect for those who want to visualize their progress, understand how their well-being affects their productivity, and maintain a balanced routine.
        </p>
      </div>
    </div>
  );
};

export default About;
