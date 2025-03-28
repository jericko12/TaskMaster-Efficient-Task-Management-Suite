import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/tasks/TaskForm';
import { useApp } from '../store/AppContext';
import { Task } from '../types';

export function CreateTaskPage() {
  const navigate = useNavigate();
  const { tasks } = useApp();
  
  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      tasks.createTask(taskData);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Task</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Add task details below to create a new task.
        </p>
      </div>
      
      <TaskForm onSubmit={handleSubmit} />
    </div>
  );
} 