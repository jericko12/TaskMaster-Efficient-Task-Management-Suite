import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiClock, 
  FiPlusCircle, 
  FiTarget, 
  FiActivity, 
  FiCalendar, 
  FiList,
  FiBarChart2,
  FiFlag 
} from 'react-icons/fi';
import { useApp } from '../store/AppContext';
import { TaskList } from '../components/tasks/TaskList';
import { isTaskDueToday, isTaskOverdue, filterTasks, calculateTaskStatistics } from '../utils/helpers';
import { Task } from '../types';

export function Dashboard() {
  const { tasks, projects, settings } = useApp();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    overdue: 0,
    completionRate: 0
  });
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);
  
  useEffect(() => {
    if (!tasks.loading) {
      // Tasks due today
      const today = tasks.tasks.filter(task => 
        isTaskDueToday(task) && task.status !== 'complete'
      );
      
      // Overdue tasks
      const overdue = tasks.tasks.filter(task => 
        isTaskOverdue(task) && task.status !== 'complete'
      );
      
      // Upcoming tasks (not due today, not overdue, not completed)
      const upcoming = tasks.tasks.filter(task => 
        !isTaskDueToday(task) && !isTaskOverdue(task) && task.status !== 'complete'
      ).slice(0, 5); // Limit to 5 tasks
      
      // Calculate statistics
      const statistics = calculateTaskStatistics(tasks.tasks);
      
      setTodayTasks(today);
      setOverdueTasks(overdue);
      setUpcomingTasks(upcoming);
      setStats(statistics);
    }
  }, [tasks.tasks, tasks.loading]);

  // Calculate tasks by priority
  const highPriorityTasks = tasks.tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.tasks.filter(task => task.priority === 'low').length;
  
  // Calculate tasks by status (excluding completed)
  const pendingTasks = tasks.tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.tasks.filter(task => task.status === 'in-progress').length;

  return (
    <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/tasks" className="btn-primary flex items-center">
          <FiPlusCircle className="mr-2" /> New Task
        </Link>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="dark-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4" style={{backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : ''}}>
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 mr-3">
              <FiList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="dark-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4" style={{backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : ''}}>
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 mr-3">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-semibold">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="dark-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4" style={{backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : ''}}>
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/30 mr-3">
              <FiClock className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
              <p className="text-xl font-semibold">{stats.overdue}</p>
            </div>
          </div>
        </div>
        
        <div className="dark-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4" style={{backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : ''}}>
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30 mr-3">
              <FiTarget className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-xl font-semibold">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks Sections */}
      <div className="space-y-8 mb-8">
        <div>
          <div className="flex items-center mb-4">
            <FiCalendar className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
          </div>
          <TaskList 
            title="Due Today" 
            tasks={todayTasks}
            emptyMessage="No tasks due today"
            collapsible={false}
          />
        </div>
        
        {overdueTasks.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <FiClock className="text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Overdue</h2>
            </div>
            <TaskList 
              title="Overdue Tasks" 
              tasks={overdueTasks}
              emptyMessage="No overdue tasks"
              collapsible={false}
            />
          </div>
        )}
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiActivity className="text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
            </div>
            <Link to="/tasks" className="text-blue-500 text-sm hover:text-blue-600">
              View All
            </Link>
          </div>
          <TaskList 
            title="Upcoming" 
            tasks={upcomingTasks}
            emptyMessage="No upcoming tasks"
            collapsible={false}
          />
        </div>
      </div>
      
      {/* Analytics Section */}
      <div className="mt-8">
        <div className="flex items-center mb-6">
          <FiBarChart2 className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tasks by Priority */}
          <div className="dark-card bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700" style={{backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : ''}}>
            <h3 className="font-medium mb-4">Tasks by Priority</h3>
            
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{highPriorityTasks}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (highPriorityTasks / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{mediumPriorityTasks}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (mediumPriorityTasks / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{lowPriorityTasks}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (lowPriorityTasks / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Tasks by Status */}
          <div className="dark-card bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700" style={{backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : ''}}>
            <h3 className="font-medium mb-4">Tasks by Status</h3>
            
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.completed}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{inProgressTasks}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (inProgressTasks / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{pendingTasks}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (pendingTasks / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 