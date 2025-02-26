import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const AddTaskForm = () => {
  const { addTask } = useTaskContext();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 3, // Default priority (medium)
    completed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      await addTask({
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate || null,
        priority: Number(newTask.priority),
        completed: false
      });

      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: '', 
        priority: 3, 
        completed: false 
      });
    } catch {
      setError("Failed to add task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add a Task</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Task title"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Task description"
            className="w-full p-2 border rounded-md"
            rows="3"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="1">High</option>
            <option value="2">Medium-High</option>
            <option value="3">Medium</option>
            <option value="4">Medium-Low</option>
            <option value="5">Low</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 rounded-md text-white 
            ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;