import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FirebaseStatus from './components/FirebaseStatus';
import { TaskProvider } from './context/TaskContext';
import './App.css';

function App() {
  const [showConfig, setShowConfig] = useState(false);
  
  return (
    <TaskProvider>
      <div className="app">
        <header className="app-header">
          <h1><i className="fas fa-tasks"></i> Personal Task Manager</h1>
          <p>Manage your tasks with this Firebase-powered application</p>
        </header>
        
        <FirebaseStatus />
        
        <div className="task-manager">
          <TaskForm />
          <TaskList />
        </div>
        
        <footer className="app-footer">
          <p>Personal Task Manager &copy; {new Date().getFullYear()}</p>
          <button 
            className="config-toggle"
            onClick={() => setShowConfig(!showConfig)}
          >
            {showConfig ? 'Hide Configuration' : 'Show Firebase Config'}
          </button>
        </footer>
      </div>
    </TaskProvider>
  );
}

export default App;
