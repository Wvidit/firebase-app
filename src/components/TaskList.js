import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, loading, firebaseReady } = useTasks();
  
  if (!firebaseReady) return null;
  
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-stats">
        <div>Total Tasks: <span>{tasks.length}</span></div>
        <div>Completed: <span>{completedTasks}</span></div>
        <div>Pending: <span>{pendingTasks}</span></div>
      </div>
      
      <ul className="task-list">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
