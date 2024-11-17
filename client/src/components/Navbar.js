import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/favicon.ico'; // Path to the logo
import profilePic from '../assets/profile.png'; // Path to the profile picture

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img src={logo} alt="Productivity Dashboard Logos" className="navbar-logo" />
          <span className="ms-3">Productivity Dashboard</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks">Tasks</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/survey">Survey</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/wellness">Wellness</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/predictor">Productivity Predictor</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                {/* Bell icon for notifications */}
                {/* <li className="nav-item">
                  <FontAwesomeIcon 
                    icon={faBell} 
                    className="nav-link bell-icon" 
                    style={{ cursor: 'pointer', fontSize: '1.5rem' }} 
                    onClick={() => alert('No new notifications')} // Example notification behavior
                  />
                </li> */}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
                <li className="nav-item">
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="rounded-circle" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }} 
                    onClick={handleProfileClick}
                  />
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
