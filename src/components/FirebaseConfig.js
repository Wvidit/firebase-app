import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const FirebaseConfig = () => {
  const { initFirebase } = useTasks();
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    for (const key in config) {
      if (!config[key]) {
        setError(`Please fill in the ${key} field`);
        return;
      }
    }
    
    // Save config to .env.local
    localStorage.setItem('firebaseConfig', JSON.stringify(config));
    
    // Initialize Firebase
    initFirebase();
    setError('');
  };

  return (
    <div className="firebase-config">
      <h2><i className="fas fa-fire"></i> Firebase Configuration</h2>
      <p>Enter your Firebase credentials to connect:</p>
      
      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-group">
          <label>API Key</label>
          <input 
            type="text" 
            name="apiKey"
            value={config.apiKey}
            onChange={handleChange}
            placeholder="AIzaSyD..."
          />
        </div>
        
        <div className="form-group">
          <label>Auth Domain</label>
          <input 
            type="text" 
            name="authDomain"
            value={config.authDomain}
            onChange={handleChange}
            placeholder="your-project.firebaseapp.com"
          />
        </div>
        
        <div className="form-group">
          <label>Project ID</label>
          <input 
            type="text" 
            name="projectId"
            value={config.projectId}
            onChange={handleChange}
            placeholder="your-project-id"
          />
        </div>
        
        <div className="form-group">
          <label>Storage Bucket</label>
          <input 
            type="text" 
            name="storageBucket"
            value={config.storageBucket}
            onChange={handleChange}
            placeholder="your-project.appspot.com"
          />
        </div>
        
        <div className="form-group">
          <label>Messaging Sender ID</label>
          <input 
            type="text" 
            name="messagingSenderId"
            value={config.messagingSenderId}
            onChange={handleChange}
            placeholder="1234567890"
          />
        </div>
        
        <div className="form-group">
          <label>App ID</label>
          <input 
            type="text" 
            name="appId"
            value={config.appId}
            onChange={handleChange}
            placeholder="1:1234567890:web:abc123..."
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="btn btn-primary">
          <i className="fas fa-plug"></i> Connect to Firebase
        </button>
      </form>
    </div>
  );
};

export default FirebaseConfig;
