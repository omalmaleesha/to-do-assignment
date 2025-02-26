// Import jest-mock explicitly to ensure it's available
import { jest } from '@jest/globals';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../TaskList';

// Mock the TaskContext module before imports
jest.mock('../../context/TaskContext', () => ({
  useTaskContext: jest.fn()
}));

// Import the mocked module
import { useTaskContext } from '../../context/TaskContext';

describe('TaskList', () => {
  // Mock data - expanded to more than 5 tasks
  const mockTasks = [
    {
      id: '1',
      title: 'Complete project',
      description: 'Finish the React project',
      dueDate: '2025-03-15T14:00:00',
      priority: 1,
      completed: false
    },
    {
      id: '2',
      title: 'Study Jest',
      description: 'Learn more about testing with Jest',
      dueDate: null,
      priority: 3,
      completed: false
    },
    {
      id: '3',
      title: 'Low priority task',
      description: 'This can wait',
      dueDate: '2025-04-01T09:00:00',
      priority: 5,
      completed: false
    },
    {
      id: '4',
      title: 'Medium-High priority task',
      description: 'Should be done soon',
      dueDate: '2025-03-20T11:00:00',
      priority: 2,
      completed: false
    },
    {
      id: '5',
      title: 'Medium-Low priority task',
      description: 'Less important but still needed',
      dueDate: '2025-03-25T10:00:00',
      priority: 4,
      completed: false
    },
    {
      id: '6',
      title: 'Extra task that should not show',
      description: 'This task should not be visible in the list',
      dueDate: '2025-05-01T15:00:00',
      priority: 3,
      completed: false
    }
  ];

  const mockCompleteTask = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state correctly', () => {
    useTaskContext.mockReturnValue({
      tasks: [],
      loading: true,
      error: null
    });

    render(<TaskList />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    useTaskContext.mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to fetch tasks'
    });

    render(<TaskList />);
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
  });

  test('renders empty state correctly', () => {
    useTaskContext.mockReturnValue({
      tasks: [],
      loading: false,
      error: null
    });

    render(<TaskList />);
    expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
  });

  test('renders only 5 most recent tasks', () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks,
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    render(<TaskList />);

    // Check if first 5 tasks are rendered
    expect(screen.getByText('Complete project')).toBeInTheDocument();
    expect(screen.getByText('Study Jest')).toBeInTheDocument();
    expect(screen.getByText('Low priority task')).toBeInTheDocument();
    expect(screen.getByText('Medium-High priority task')).toBeInTheDocument();
    expect(screen.getByText('Medium-Low priority task')).toBeInTheDocument();
    
    // Check that the 6th task is not rendered
    expect(screen.queryByText('Extra task that should not show')).not.toBeInTheDocument();
    
    // Check for the "showing X of Y tasks" message
    expect(screen.getByText('Showing 5 most recent tasks of 6 total')).toBeInTheDocument();
  });

  test('does not show count message when there are 5 or fewer tasks', () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks.slice(0, 5),
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    render(<TaskList />);
    
    // No message should be shown
    expect(screen.queryByText(/Showing .* tasks of/)).not.toBeInTheDocument();
  });

  test('calls completeTask when Complete button is clicked', async () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks,
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    render(<TaskList />);
    
    // Get all Complete buttons
    const completeButtons = screen.getAllByRole('button', { name: /Complete/i });
    
    // Click the first one
    await userEvent.click(completeButtons[0]);
    
    // Check if completeTask was called with correct ID
    expect(mockCompleteTask).toHaveBeenCalledWith('1');
  });

  test('calls deleteTask when Delete button is clicked', async () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks,
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    render(<TaskList />);
    
    // Get all Delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    
    // Click the first one
    await userEvent.click(deleteButtons[0]);
    
    // Check if deleteTask was called with correct ID
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  test('formats dates correctly', () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks,
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    // Mock Date.prototype.toLocaleString to return consistent value for testing
    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = jest.fn(() => 'March 15, 2025, 2:00:00 PM');
    
    render(<TaskList />);
    
    // Check for formatted date
    expect(screen.getByText('Due: March 15, 2025, 2:00:00 PM')).toBeInTheDocument();
    
    // Restore original method
    Date.prototype.toLocaleString = originalToLocaleString;
  });

  test('applies correct styling for different priorities', () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks,
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    render(<TaskList />);
    
    // High priority (red)
    const highPrioritySpan = screen.getByText('High').closest('span');
    expect(highPrioritySpan).toHaveClass('bg-red-100');
    expect(highPrioritySpan).toHaveClass('text-red-800');
    
    // Medium priority (yellow)
    const mediumPrioritySpan = screen.getByText('Medium').closest('span');
    expect(mediumPrioritySpan).toHaveClass('bg-yellow-100');
    expect(mediumPrioritySpan).toHaveClass('text-yellow-800');
    
    // Low priority (green)
    const lowPrioritySpan = screen.getByText('Low').closest('span');
    expect(lowPrioritySpan).toHaveClass('bg-green-100');
    expect(lowPrioritySpan).toHaveClass('text-green-800');
  });

  test('displays all priorities correctly', () => {
    useTaskContext.mockReturnValue({
      tasks: mockTasks.slice(0, 5), // Get tasks with all priorities
      completeTask: mockCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null
    });

    render(<TaskList />);
    
    // Check all priority labels
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium-High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Medium-Low')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});