import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string | null;
  categoryId: string | null;
  tags: string[];
  subtasks: SubTask[];
  timeEstimate: number | null; // in minutes
  timeSpent: number | null; // in minutes
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        setLoading(true);
        const savedTasks = localStorage.getItem('taskmaster_tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        setError(error as Error);
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Create a new task
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };

  // Get a task by ID
  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id) || null;
  };

  // Update a task
  const updateTask = (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              ...taskData, 
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Add a subtask
  const addSubtask = (taskId: string, subtaskTitle: string) => {
    const newSubtask: SubTask = {
      id: uuidv4(),
      title: subtaskTitle,
      completed: false,
    };

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: [...task.subtasks, newSubtask],
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );

    return newSubtask;
  };

  // Toggle subtask completion
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId 
                  ? { ...subtask, completed: !subtask.completed } 
                  : subtask
              ),
              updatedAt: new Date().toISOString() 
            } 
          : task
      )
    );
  };

  // Update task status
  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    updateTask(taskId, { status });
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    updateTaskStatus
  };
} 