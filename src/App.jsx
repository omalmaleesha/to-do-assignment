import { TaskProvider } from './context/TaskContext';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <TaskProvider>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          <AddTaskForm />
          <TaskList />
        </div>
      </div>
    </TaskProvider>
  );
};

export default App;