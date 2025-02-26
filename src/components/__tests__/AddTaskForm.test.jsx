// Import jest-mock explicitly to ensure it's available
import { jest } from '@jest/globals';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskForm from '../AddTaskForm';

// Mock the TaskContext module before imports
jest.mock('../../context/TaskContext', () => ({
  useTaskContext: jest.fn()
}));

// Import the mocked module
import { useTaskContext } from '../../context/TaskContext';

describe('AddTaskForm', () => {
  const mockAddTask = jest.fn();
  
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Default mock implementation
    useTaskContext.mockReturnValue({
      addTask: mockAddTask
    });
  });

  test('renders the form correctly', () => {
    render(<AddTaskForm />);
    
    // Check for header and form elements
    expect(screen.getByText('Add a Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Task/i })).toBeInTheDocument();
  });

  test('updates form state when inputs change', async () => {
    render(<AddTaskForm />);
    
    // Get form inputs
    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);
    
    // Simulate user input
    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, 'This is a test task');
    
    // Due date requires a specific format
    fireEvent.change(dueDateInput, { target: { value: '2025-03-01T12:00' } });
    
    // Change priority to High
    await userEvent.selectOptions(prioritySelect, '1');
    
    // Check if inputs have the correct values
    expect(titleInput).toHaveValue('Test Task');
    expect(descriptionInput).toHaveValue('This is a test task');
    expect(dueDateInput).toHaveValue('2025-03-01T12:00');
    expect(prioritySelect).toHaveValue('1');
  });

  test('submits form with correct data', async () => {
    mockAddTask.mockResolvedValueOnce();
    
    render(<AddTaskForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/Title/i), 'New Task');
    await userEvent.type(screen.getByLabelText(/Description/i), 'Task description');
    fireEvent.change(screen.getByLabelText(/Due Date/i), { 
      target: { value: '2025-03-01T12:00' } 
    });
    await userEvent.selectOptions(screen.getByLabelText(/Priority/i), '1');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    
    // Check if addTask was called with the correct data
    expect(mockAddTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task description',
      dueDate: '2025-03-01T12:00',
      priority: 1,
      completed: false
    });
  });

  test('does not submit if title is empty', async () => {
    render(<AddTaskForm />);
    
    // Fill form with empty title
    await userEvent.type(screen.getByLabelText(/Title/i), '   ');
    await userEvent.type(screen.getByLabelText(/Description/i), 'Description');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    
    // Check that addTask was not called
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  test('resets form after successful submission', async () => {
    mockAddTask.mockResolvedValueOnce();
    
    render(<AddTaskForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/Title/i), 'Test Task');
    await userEvent.type(screen.getByLabelText(/Description/i), 'Description');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    
    // Wait for async operations
    await waitFor(() => {
      // Check that form was reset
      expect(screen.getByLabelText(/Title/i)).toHaveValue('');
      expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    });
  });

  test('displays error message when submission fails', async () => {
    // Mock a rejected promise to simulate an error
    mockAddTask.mockRejectedValueOnce(new Error('Failed'));
    
    render(<AddTaskForm />);
    
    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/Title/i), 'Test Task');
    await userEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to add task/i)).toBeInTheDocument();
    });
  });

  test('disables submit button during submission', async () => {
    // Create a promise that we can resolve manually
    let resolveAddTask;
    const addTaskPromise = new Promise(resolve => {
      resolveAddTask = resolve;
    });
    
    mockAddTask.mockReturnValueOnce(addTaskPromise);
    
    render(<AddTaskForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/Title/i), 'Test Task');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    
    // Check button is disabled and has loading text
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    
    // Resolve the promise
    resolveAddTask();
    
    // Check button is enabled again
    await waitFor(() => {
      expect(screen.getByText('Save Task')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});