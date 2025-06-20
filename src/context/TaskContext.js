import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy } from 'firebase/firestore';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (!firebaseReady) return;

    const unsubscribe = onSnapshot(
      collection(db, "tasks"), 
      (snapshot) => {
        const tasksData = [];
        snapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        setError("Error loading tasks: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseReady]);

  const addTask = async (description) => {
    try {
      await addDoc(collection(db, "tasks"), {
        description,
        isCompleted: false,
        createdAt: new Date()
      });
      return true;
    } catch (err) {
      setError("Error adding task: " + err.message);
      return false;
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        isCompleted: !currentStatus
      });
      return true;
    } catch (err) {
      setError("Error updating task: " + err.message);
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      return true;
    } catch (err) {
      setError("Error deleting task: " + err.message);
      return false;
    }
  };

  const initFirebase = () => {
    setFirebaseReady(true);
  };

  const value = {
    tasks,
    loading,
    error,
    firebaseReady,
    initFirebase,
    addTask,
    toggleTaskStatus,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
