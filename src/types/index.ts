export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'complete' | 'in-progress' | 'pending';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string
  tags: string[];
  category?: string;
  projectId?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurringCustomPattern?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system' | string;
  defaultView: 'daily' | 'weekly' | 'project';
  defaultSortBy: 'dueDate' | 'priority' | 'status' | 'created' | 'updated';
  defaultSortOrder: 'asc' | 'desc';
  defaultFilterPresets: FilterPreset[];
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  pomodorosUntilLongBreak: number;
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
  reminderTime: number; // minutes before due date
  highContrastMode: boolean;
  largeTextMode: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    status?: TaskStatus[];
    priority?: TaskPriority[];
    tags?: string[];
    category?: string;
    project?: string;
    dueDate?: {
      from?: string;
      to?: string;
    };
  };
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  completed: boolean;
}

export interface Statistics {
  tasksCompleted: number;
  tasksCreated: number;
  tasksOverdue: number;
  totalTimeSpent: number; // in minutes
  pomodorosCompleted: number;
  completionRate: number; // percentage
}

export interface Notification {
  id: string;
  taskId?: string;
  title: string;
  message: string;
  type: 'reminder' | 'due' | 'overdue' | 'system';
  createdAt: string;
  read: boolean;
} 