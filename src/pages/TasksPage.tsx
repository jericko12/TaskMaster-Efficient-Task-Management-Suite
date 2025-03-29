import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiFilter, 
  FiSliders, 
  FiGrid, 
  FiList as FiListIcon,
  FiCalendar,
  FiMoreVertical,
  FiCheck,
  FiEdit3
} from 'react-icons/fi';
import { useApp } from '../store/AppContext';
import { Task } from '../types';

export function TasksPage() {
  const { tasks } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Sort tasks by due date (most recent first)
  const sortedTasks = [...tasks.tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Mark task as complete
  const handleMarkComplete = (taskId: string) => {
    tasks.changeTaskStatus(taskId, 'complete');
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-300">
            Manage and organize your tasks
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiFilter className="mr-2" /> Filters
          </button>
          
          <div className="bg-white dark:bg-gray-700 rounded-md flex border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              aria-label="List view"
            >
              <FiListIcon />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
          </div>
          
          <Link 
            to="/tasks/create" 
            className="btn-primary flex items-center px-3 py-2 text-sm font-medium shadow-sm hover:shadow"
          >
            <FiPlus className="mr-2" /> Add Task
          </Link>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Filter Tasks</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <FiSliders />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                Status
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                Priority
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all">
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                Due Date
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all">
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                Sort By
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-all">
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
                <option value="created">Date Created</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {tasks.loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 dark:bg-blue-700 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-2.5"></div>
            <div className="h-3 w-36 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiListIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by creating your first task. Tasks will help you organize your work and stay productive.
          </p>
          <Link to="/tasks/create" className="btn-primary inline-flex items-center px-4 py-2 shadow-sm hover:shadow transition-all">
            <FiPlus className="mr-2" /> Create Task
          </Link>
        </div>
      ) : (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}`}>
          {sortedTasks.map((task: Task) => (
            <div 
              key={task.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
                shadow-sm hover:shadow transition-all duration-200 overflow-hidden
                ${task.status === 'complete' ? 'opacity-75' : 'opacity-100'}
                ${viewMode === 'list' ? '' : 'h-full'}`}
            >
              <div className={`h-1.5 ${
                task.priority === 'high' ? 'bg-red-500' : 
                task.priority === 'medium' ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}></div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start">
                    <button 
                      onClick={() => handleMarkComplete(task.id)}
                      className={`mt-0.5 mr-3 w-5 h-5 rounded-full flex-shrink-0 border ${
                        task.status === 'complete' 
                          ? 'bg-green-500 border-green-500 text-white flex items-center justify-center' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'
                      }`}
                    >
                      {task.status === 'complete' && <FiCheck className="w-3 h-3" />}
                    </button>
                    <h3 className={`font-medium ${task.status === 'complete' ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  <div className="dropdown relative">
                    <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>
                
                {task.description && (
                  <p className={`text-gray-600 dark:text-gray-400 text-sm ml-8 mb-3 line-clamp-2 ${
                    task.status === 'complete' ? 'line-through opacity-60' : ''
                  }`}>
                    {task.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 ml-8 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'in-progress' ? 'In Progress' : 
                     task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
                
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between ml-8">
                  {task.dueDate && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="mr-1.5 h-4 w-4" />
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'complete' ? 'text-red-500 dark:text-red-400 font-medium' : ''}>
                        {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/tasks/${task.id}/edit`} 
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                    >
                      <FiEdit3 className="mr-1 h-3.5 w-3.5" /> Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 