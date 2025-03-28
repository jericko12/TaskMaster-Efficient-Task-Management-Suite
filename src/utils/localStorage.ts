import { Task, Project, Category, Tag, UserSettings } from '../types';

// LocalStorage Keys
const TASKS_KEY = 'taskmaster:tasks';
const PROJECTS_KEY = 'taskmaster:projects';
const CATEGORIES_KEY = 'taskmaster:categories';
const TAGS_KEY = 'taskmaster:tags';
const SETTINGS_KEY = 'taskmaster:settings';
const POMODORO_HISTORY_KEY = 'taskmaster:pomodoro_history';
const FILTER_PRESETS_KEY = 'taskmaster:filter_presets';
const BACKUP_TIMESTAMP_KEY = 'taskmaster:last_backup';

// Generic get function
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
};

// Generic set function
const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
  }
};

// Tasks
export const getTasks = (): Task[] => getItem<Task[]>(TASKS_KEY, []);
export const setTasks = (tasks: Task[]): void => setItem(TASKS_KEY, tasks);
export const addTask = (task: Task): void => {
  const tasks = getTasks();
  setTasks([...tasks, task]);
};
export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    setTasks(tasks);
  }
};
export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  setTasks(tasks.filter(task => task.id !== taskId));
};

// Projects
export const getProjects = (): Project[] => getItem<Project[]>(PROJECTS_KEY, []);
export const setProjects = (projects: Project[]): void => setItem(PROJECTS_KEY, projects);
export const addProject = (project: Project): void => {
  const projects = getProjects();
  setProjects([...projects, project]);
};
export const updateProject = (updatedProject: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex(project => project.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    setProjects(projects);
  }
};
export const deleteProject = (projectId: string): void => {
  const projects = getProjects();
  setProjects(projects.filter(project => project.id !== projectId));
};

// Categories
export const getCategories = (): Category[] => getItem<Category[]>(CATEGORIES_KEY, []);
export const setCategories = (categories: Category[]): void => setItem(CATEGORIES_KEY, categories);
export const addCategory = (category: Category): void => {
  const categories = getCategories();
  setCategories([...categories, category]);
};
export const updateCategory = (updatedCategory: Category): void => {
  const categories = getCategories();
  const index = categories.findIndex(category => category.id === updatedCategory.id);
  if (index !== -1) {
    categories[index] = updatedCategory;
    setCategories(categories);
  }
};
export const deleteCategory = (categoryId: string): void => {
  const categories = getCategories();
  setCategories(categories.filter(category => category.id !== categoryId));
};

// Tags
export const getTags = (): Tag[] => getItem<Tag[]>(TAGS_KEY, []);
export const setTags = (tags: Tag[]): void => setItem(TAGS_KEY, tags);
export const addTag = (tag: Tag): void => {
  const tags = getTags();
  setTags([...tags, tag]);
};
export const updateTag = (updatedTag: Tag): void => {
  const tags = getTags();
  const index = tags.findIndex(tag => tag.id === updatedTag.id);
  if (index !== -1) {
    tags[index] = updatedTag;
    setTags(tags);
  }
};
export const deleteTag = (tagId: string): void => {
  const tags = getTags();
  setTags(tags.filter(tag => tag.id !== tagId));
};

// Settings
export const getDefaultSettings = (): UserSettings => ({
  theme: 'system',
  defaultView: 'daily',
  defaultSortBy: 'dueDate',
  defaultSortOrder: 'asc',
  defaultFilterPresets: [],
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,
  notificationsEnabled: true,
  remindersEnabled: true,
  reminderTime: 30,
  highContrastMode: false,
  largeTextMode: false,
});

export const getSettings = (): UserSettings => getItem<UserSettings>(SETTINGS_KEY, getDefaultSettings());
export const setSettings = (settings: UserSettings): void => setItem(SETTINGS_KEY, settings);
export const updateSettings = (partialSettings: Partial<UserSettings>): void => {
  const currentSettings = getSettings();
  setSettings({ ...currentSettings, ...partialSettings });
};

// Data import/export
export const exportData = (): string => {
  const data = {
    tasks: getTasks(),
    projects: getProjects(),
    categories: getCategories(),
    tags: getTags(),
    settings: getSettings(),
  };
  return JSON.stringify(data);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.tasks) setTasks(data.tasks);
    if (data.projects) setProjects(data.projects);
    if (data.categories) setCategories(data.categories);
    if (data.tags) setTags(data.tags);
    if (data.settings) setSettings(data.settings);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Auto backup
export const createBackup = (): void => {
  const backup = exportData();
  setItem(`${BACKUP_TIMESTAMP_KEY}_${Date.now()}`, backup);
  setItem(BACKUP_TIMESTAMP_KEY, Date.now());
};

export const getLastBackupTime = (): number => {
  return getItem<number>(BACKUP_TIMESTAMP_KEY, 0);
};

export const restoreFromBackup = (timestamp: number): boolean => {
  const backupData = getItem<string>(`${BACKUP_TIMESTAMP_KEY}_${timestamp}`, '');
  if (backupData) {
    return importData(backupData);
  }
  return false;
};

// Clear all data (for testing/resetting)
export const clearAllData = (): void => {
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(PROJECTS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
  localStorage.removeItem(TAGS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(POMODORO_HISTORY_KEY);
  localStorage.removeItem(FILTER_PRESETS_KEY);
}; 