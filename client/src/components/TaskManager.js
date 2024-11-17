import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManager.css'; // Import the CSS file

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [tags, setTags] = useState(''); // New state for tags
  const [priority, setPriority] = useState('Medium'); // New state for priority

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle form submission to create a new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { title, dueDate, category, tags, priority },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchTasks();
      setTitle('');
      setDueDate('');
      setCategory('');
      setTags('');
      setPriority('Medium');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Toggle the completion status of a task
  const toggleComplete = async (id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: data.completed } : task
        )
      );
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="container task-manager">
      <h2 className="text-center mb-4">Task Manager</h2>
      <form className="form-inline justify-content-center mb-4" onSubmit={handleSubmit}>
        <div className="form-group mx-sm-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="New Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group mx-sm-3 mb-2">
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group mx-sm-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-group mx-sm-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group mx-sm-3 mb-2">
          <select
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success mb-2">
          Add Task
        </button>
      </form>

      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className={`list-group-item d-flex justify-content-between align-items-center ${task.priority.toLowerCase()}`}>
            <span
              className={`task-title ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleComplete(task._id)}
            >
              {task.title} 
              <small className="text-muted">
                {' '}
                (Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}, {task.category || 'No category'})
              </small>
              <br />
              <small className="text-muted">Tags: {task.tags.join(', ') || 'No tags'}</small>
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
