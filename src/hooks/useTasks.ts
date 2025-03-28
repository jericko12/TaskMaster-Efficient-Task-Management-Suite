import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import * as localStorage from '../utils/localStorage';
import { generateId } from '../utils/helpers';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getTasks();
      setTasks(savedTasks);
      setError(null);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setTasks(tasks);
      } catch (err) {
        console.error('Error saving tasks:', err);
        setError('Failed to save tasks');
      }
    }
  }, [tasks, loading]);

  // Create a new task
  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  }, []);

  // Update an existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  // Toggle task completion status
  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              status: !task.completed ? 'complete' : 'pending',
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  }, []);

  // Change task status
  const changeTaskStatus = useCallback((taskId: string, status: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status,
              completed: status === 'complete',
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  }, []);

  // Change task priority
  const changeTaskPriority = useCallback((taskId: string, priority: Task['priority']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              priority,
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  }, []);

  // Bulk update tasks (used for reordering)
  const bulkUpdateTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, []);

  // Reorder tasks within a single list
  const reorderTasks = useCallback((sourceIndex: number, destinationIndex: number) => {
    setTasks(prevTasks => {
      const result = Array.from(prevTasks);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    changeTaskStatus,
    changeTaskPriority,
    bulkUpdateTasks,
    reorderTasks,
  };
} 