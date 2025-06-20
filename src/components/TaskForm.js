import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const TaskForm = () => {
  const [newTask, setNewTask] = useState('');
  const { addTask, firebaseReady } = useTasks();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const success = await addTask(newTask);
    if (success) setNewTask('');
  };

  if (!firebaseReady) return null;

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task..."
        className="task-input"
      />
      <button type="submit" className="add-button">
        <i className="fas fa-plus"></i> Add Task
      </button>
    </form>
  );
};

export default TaskForm;
