// src/App.js
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { FaPlus, FaTrash, FaCheck, FaUndo } from 'react-icons/fa';
import './App.css';

// Initialize Firebase with config values
const firebaseConfig = {
  apiKey: "AIzaSyCZEL-GCj4CR7zadwDi8yAgCk-LIZAuqYc",
  authDomain: "task-manager-a99bf.firebaseapp.com",
  projectId: "task-manager-a99bf",
  storageBucket: "task-manager-a99bf.firebasestorage.app",
  messagingSenderId: "33906649727",
  appId: "1:33906649727:web:a94ea90e361c91a0156d4a",
  measurementId: "G-5BQB1J7VXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Retrieve all tasks from Firestore
  useEffect(() => {
    if (!firebaseReady) return;
    
    setLoading(true);
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      setError("Error fetching tasks: " + error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  // Create new task in Firestore
  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    try {
      await addDoc(collection(db, "tasks"), {
        description: newTask,
        isCompleted: false,
        createdAt: new Date()
      });
      setNewTask('');
      setError(null);
    } catch (err) {
      setError("Error adding task: " + err.message);
    }
  };

  // Update task status in Firestore
  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        isCompleted: !currentStatus
      });
      setError(null);
    } catch (err) {
      setError("Error updating task: " + err.message);
    }
  };

  // Delete task from Firestore
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setError(null);
    } catch (err) {
      setError("Error deleting task: " + err.message);
    }
  };

  // Initialize Firebase connection
  const initFirebase = () => {
    setFirebaseReady(true);
  };

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app">
      <header className="app-header">
        <h1><i className="logo-icon">✓</i> Personal Task Manager</h1>
        <p>Manage your tasks with Firebase integration</p>
      </header>
      
      {!firebaseReady ? (
        <div className="firebase-config">
          <h2>Firebase Setup Required</h2>
          <p>Click the button below to initialize the Firebase connection</p>
          <button className="init-button" onClick={initFirebase}>
            Connect to Firebase
          </button>
          <div className="credentials-help">
            <h3>Firebase credentials are stored in environment variables</h3>
            <p>To set up your own Firebase project:</p>
            <ol>
              <li>Create a project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Enable Firestore Database in test mode</li>
              <li>Create a web app and get your configuration</li>
              <li>Set environment variables in your .env file</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="task-manager">
          <div className="task-form-container">
            <form onSubmit={addTask} className="task-form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task..."
                className="task-input"
              />
              <button type="submit" className="add-button">
                <FaPlus /> Add Task
              </button>
            </form>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="task-stats">
            <div className="stat-card">
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completedTasks}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{pendingTasks}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="task-list-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No tasks yet</h3>
                <p>Add your first task using the form above</p>
              </div>
            ) : (
              <ul className="task-list">
                {tasks.map((task) => (
                  <li 
                    key={task.id} 
                    className={`task-item ${task.isCompleted ? 'completed' : ''}`}
                  >
                    <div className="task-content">
                      <button
                        className="status-button"
                        onClick={() => toggleTaskStatus(task.id, task.isCompleted)}
                      >
                        {task.isCompleted ? <FaCheck className="completed-icon" /> : <div className="incomplete-icon" />}
                      </button>
                      <span className="task-description">{task.description}</span>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      <footer className="app-footer">
        <p>Personal Task Manager &copy; {new Date().getFullYear()} | Firebase Integration</p>
      </footer>
    </div>
  );
}

export default App;
