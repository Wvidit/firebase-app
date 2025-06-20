import React from 'react';
import { useTasks } from '../context/TaskContext';
import FirebaseConfig from './FirebaseConfig';

const FirebaseStatus = () => {
  const { firebaseReady, error } = useTasks();
  
  if (firebaseReady && !error) return null;
  
  return (
    <div className="firebase-status-container">
      {!firebaseReady && <FirebaseConfig />}
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
    </div>
  );
};

export default FirebaseStatus;
