import { useTaskContext } from '../context/TaskContext';

const TaskList = () => {
  const { tasks, completeTask, deleteTask, loading, error } = useTaskContext();

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPriorityLabel = (priority) => {
    switch (Number(priority)) {
      case 1: return { text: 'High', color: 'bg-red-100 text-red-800' };
      case 2: return { text: 'Medium-High', color: 'bg-orange-100 text-orange-800' };
      case 3: return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 4: return { text: 'Medium-Low', color: 'bg-blue-100 text-blue-800' };
      case 5: return { text: 'Low', color: 'bg-green-100 text-green-800' };
      default: return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks available. Add a new task to get started!</p>
      </div>
    );
  }

  // Get the 5 most recent tasks
  const recentTasks = [...tasks].slice(0, 5);

  return (
    <div className="space-y-4">
      {recentTasks.map(task => {
        const priorityInfo = getPriorityLabel(task.priority);
        return (
          <div 
            key={task.id} 
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                {priorityInfo.text}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{task.description}</p>
            <div className="mt-3 text-sm text-gray-500">
              Due: {formatDate(task.dueDate)}
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => completeTask(task.id)}
                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
              >
                Complete
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
      {tasks.length > 5 && (
        <div className="text-center py-2">
          <p className="text-gray-500 text-sm">Showing 5 most recent tasks of {tasks.length} total</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;