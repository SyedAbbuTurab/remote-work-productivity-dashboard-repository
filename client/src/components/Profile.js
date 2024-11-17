import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Create and use a custom CSS file for additional styling

const Profile = () => {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await axios.get('http://localhost:5000/api/profile', config); // Adjusted route
        setUser(data);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(
        'http://localhost:5000/api/profile/email',
        { email },
        config
      );
      setMessage('Email updated successfully!');
    } catch (error) {
      console.error('Error updating email:', error);
      setMessage('Failed to update email.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(
        'http://localhost:5000/api/profile/password',
        { password },
        config
      );
      setMessage('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Failed to update password.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card shadow-sm">
        <h2 className="text-center mb-4">Profile</h2>

        <form onSubmit={handleUpdateEmail} className="mb-4">
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={user.username}
              disabled
              style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Update Email</button>
        </form>

        <form onSubmit={handleUpdatePassword}>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="form-text text-muted">Leave blank if you don't want to change the password</small>
          </div>
          <button type="submit" className="btn btn-secondary w-100">Update Password</button>
        </form>

        {message && <div className="alert alert-info mt-4">{message}</div>}
      </div>
    </div>
  );
};

export default Profile;
