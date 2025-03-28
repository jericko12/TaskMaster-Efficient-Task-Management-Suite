import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { TaskForm } from '../components/tasks/TaskForm';
import { useApp } from '../store/AppContext';
import { Task } from '../types';

export function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks } = useApp();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (taskId && !tasks.loading) {
      const foundTask = tasks.tasks.find(t => t.id === taskId);
      
      if (foundTask) {
        setTask(foundTask);
        setError(null);
      } else {
        setError('Task not found');
      }
      
      setLoading(false);
    }
  }, [taskId, tasks.tasks, tasks.loading]);
  
  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!taskId) return;
    
    try {
      tasks.updateTask(taskId, taskData);
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };
  
  const handleDelete = () => {
    if (!taskId) return;
    
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    
    if (confirmDelete) {
      try {
        tasks.deleteTask(taskId);
        navigate('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={handleBack}
          className="btn-primary flex items-center mx-auto"
        >
          <FiArrowLeft className="mr-2" /> Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold">Edit Task</h1>
        </div>
        
        <button 
          onClick={handleDelete}
          className="btn-secondary text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
        >
          <FiTrash2 className="mr-2" /> Delete
        </button>
      </div>
      
      {task && <TaskForm task={task} isEditing onSubmit={handleSubmit} />}
    </div>
  );
} 