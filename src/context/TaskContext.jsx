import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskService from '../services/TaskService';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await TaskService.getAllTasks();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    try {
      const createdTask = await TaskService.createTask(newTask);
      setTasks(prev => [createdTask, ...prev]);
      return createdTask;
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
      throw err;
    }
  };

  const completeTask = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        const updatedTask = { ...taskToUpdate, completed: true };
        await TaskService.updateTask(taskId, updatedTask);
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (err) {
      console.error("Error completing task:", err);
      setError("Failed to complete task. Please try again.");
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
      throw err;
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const updated = await TaskService.updateTask(taskId, updatedData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updated : task
      ));
      return updated;
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      loading, 
      error, 
      addTask, 
      completeTask, 
      deleteTask, 
      updateTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};