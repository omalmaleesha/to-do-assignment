import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

const TaskService = {
  getAllTasks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  getTasksByStatus: async (completed) => {
    try {
      const response = await axios.get(`${API_URL}?completed=${completed}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      throw error;
    }
  },
  
  getTask: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  },
  
  createTask: async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  }
};

export default TaskService;