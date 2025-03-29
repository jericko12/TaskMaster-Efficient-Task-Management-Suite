import { useState, useEffect } from 'react';
import { FiBarChart2, FiCheckCircle, FiClock, FiFlag } from 'react-icons/fi';
import { useApp } from '../store/AppContext';

export function AnalyticsPage() {
  const { tasks } = useApp();
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Calculate total tasks
  const totalTasks = tasks.tasks.length;
  
  // Calculate completed tasks
  const completedTasks = tasks.tasks.filter(task => task.status === 'complete').length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate tasks by priority
  const highPriorityTasks = tasks.tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.tasks.filter(task => task.priority === 'low').length;
  
  // Calculate overdue tasks
  const overdueTasks = tasks.tasks.filter(task => {
    if (!task.dueDate || task.status === 'complete') return false;
    return new Date(task.dueDate) < new Date();
  }).length;
  
  // Calculate tasks by status (excluding completed)
  const pendingTasks = tasks.tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.tasks.filter(task => task.status === 'in-progress').length;
  
  // Calculate tasks created in the last 7 days
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const tasksCreatedLast7Days = tasks.tasks.filter(task => {
    return new Date(task.createdAt) > last7Days;
  }).length;

  // Dummy data for charts (in a real app, you'd use a charting library)
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your productivity and task management metrics
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
              <FiBarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <h3 className="text-xl font-bold">{totalTasks}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
              <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <h3 className="text-xl font-bold">{completedTasks}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
              <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <h3 className="text-xl font-bold">{completionRate}%</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
              <FiFlag className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
              <h3 className="text-xl font-bold">{overdueTasks}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and detailed stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Priority */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-4">Tasks by Priority</h3>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{highPriorityTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(highPriorityTasks / totalTasks) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{mediumPriorityTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(mediumPriorityTasks / totalTasks) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{lowPriorityTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(lowPriorityTasks / totalTasks) * 100}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Tasks by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-4">Tasks by Status</h3>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{completedTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(completedTasks / totalTasks) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{inProgressTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{pendingTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${(pendingTasks / totalTasks) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Analytics is currently in development. More detailed charts and insights coming soon!
      </div>
    </div>
  );
} 