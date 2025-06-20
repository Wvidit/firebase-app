import React from 'react';
import { useTasks } from '../context/TaskContext';

const TaskItem = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  
  return (
    <li className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <button
          className="status-button"
          onClick={() => toggleTaskStatus(task.id, task.isCompleted)}
        >
          {task.isCompleted ? (
            <i className="fas fa-check completed-icon"></i>
          ) : (
            <div className="incomplete-icon"></div>
          )}
        </button>
        <span className="task-description">{task.description}</span>
      </div>
      <button
        className="delete-button"
        onClick={() => deleteTask(task.id)}
      >
        <i className="fas fa-trash"></i>
      </button>
    </li>
  );
};

export default TaskItem;
