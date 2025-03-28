import { format, isAfter, isBefore, isToday, parse } from 'date-fns';
import { Task, TaskStatus } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date for display
export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Check if a task is overdue
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'complete') return false;

  const dueDate = new Date(task.dueDate);
  const now = new Date();
  return isAfter(now, dueDate);
};

// Check if a task is due today
export const isTaskDueToday = (task: Task): boolean => {
  if (!task.dueDate) return false;
  return isToday(new Date(task.dueDate));
};

// Sort tasks by different criteria
export const sortTasks = (tasks: Task[], sortBy: string, sortOrder: 'asc' | 'desc'): Task[] => {
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return multiplier;
        if (!b.dueDate) return -multiplier;
        return multiplier * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
      case 'priority':
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return multiplier * (priorityValues[a.priority] - priorityValues[b.priority]);
      
      case 'status':
        const statusValues = { 'pending': 1, 'in-progress': 2, 'complete': 3 };
        return multiplier * (statusValues[a.status] - statusValues[b.status]);
      
      case 'created':
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      case 'updated':
        return multiplier * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      
      default:
        return 0;
    }
  });
};

// Filter tasks by different criteria
export const filterTasks = (
  tasks: Task[],
  filters: {
    status?: TaskStatus[];
    priority?: string[];
    tags?: string[];
    category?: string;
    project?: string;
    searchTerm?: string;
    dueDate?: { from?: string; to?: string };
  }
): Task[] => {
  return tasks.filter(task => {
    // Filter by status
    if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }

    // Filter by priority
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }

    // Filter by tag
    if (filters.tags && filters.tags.length > 0 && !task.tags.some(tag => filters.tags!.includes(tag))) {
      return false;
    }

    // Filter by category
    if (filters.category && task.category !== filters.category) {
      return false;
    }

    // Filter by project
    if (filters.project && task.projectId !== filters.project) {
      return false;
    }

    // Filter by search term (in title or description)
    if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by due date range
    if (filters.dueDate) {
      if (filters.dueDate.from && task.dueDate && isBefore(new Date(task.dueDate), new Date(filters.dueDate.from))) {
        return false;
      }
      if (filters.dueDate.to && task.dueDate && isAfter(new Date(task.dueDate), new Date(filters.dueDate.to))) {
        return false;
      }
    }

    return true;
  });
};

// Group tasks by date, project, category, etc.
export const groupTasksByDate = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    if (!task.dueDate) {
      const key = 'No Due Date';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(task);
      return;
    }
    
    const date = new Date(task.dueDate);
    const key = format(date, 'yyyy-MM-dd');
    
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });
  
  return grouped;
};

export const groupTasksByProject = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const key = task.projectId || 'No Project';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });
  
  return grouped;
};

export const groupTasksByCategory = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const key = task.category || 'Uncategorized';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });
  
  return grouped;
};

// Calculate statistics
export const calculateTaskStatistics = (tasks: Task[]) => {
  const completed = tasks.filter(task => task.status === 'complete').length;
  const total = tasks.length;
  const overdue = tasks.filter(task => isTaskOverdue(task)).length;
  
  return {
    completed,
    total,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

// Get color for priority
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

// Get color for status
export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'complete':
      return 'text-green-500';
    case 'in-progress':
      return 'text-blue-500';
    case 'pending':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

// Format time for display (minutes to hours and minutes)
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}; 